// pages/login/bindphone/index.js
const app = getApp();
const api = require("api.js");
const util = require("../../../utils/util.js");

Page({
  data: {
    codemsg: "发送验证码",
    currentTime: 61,
    disabled: false, //button是否禁用
    phone: "",
    userInfo: null
  },
  onLoad: function (options) {
    let that = this;
    var uinfo = app.globalData.userInfo;
    that.setData({
      userInfo: uinfo
    });
  },
  formSubmit(e) {
    var tel = e.detail.value.phone;
    //验证手机号
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(tel)) {
      util.showErrorModal("手机号不合法");
      return false;
    }
    var that = this;
    //提交绑定手机号
    api.BindingPhone({
      data: {
        phone: tel,
        smscode: e.detail.value.code,
        uid: that.data.userInfo.id
      },
      method: "POST",
      success: (res) => {
        util.showSuccessModal("绑定手机号成功！");
        //更新用户存储缓存
        wx.setStorageSync("fc_card_ulogin", res.data.Data);
        //绑定成功跳转到支付页面
        setTimeout(function () {
          that.toPay();
        }, 1000);
      }
    });
  },
  toPay: function () {
    // 前往首页界面
    wx.navigateTo({
      url: "/pages/start/version/version"
    });
  },
  //手机号输入监听事件
  handlePhonechage(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  //获取验证码
  handleGetCode() {
    //验证手机号
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.phone)) {
      util.showErrorModal("手机号不合法");
      return false;
    }
    var that = this;
    //发送验证码
    api.SendCode({
      data: {
        phone: that.data.phone
      },
      method: "post",
      success: (res) => {
        if (res.data.StatusCode == 200) {
          util.showSuccessModal("发送成功");
          that.setCodeTime();
        }
      }
    });
  },
  //设置验证码倒计时
  setCodeTime() {
    var that = this;
    var currentTime = that.data.currentTime;
    let interval = setInterval(function () {
      currentTime--;
      that.setData({
        codemsg: currentTime + "秒后重试发送",
        disabled: true
      });
      if (currentTime <= 0) {
        clearInterval(interval);
        that.setData({
          codemsg: "重新发送",
          currentTime: 61,
          disabled: false
        });
      }
    }, 1000);
  },
  //获取微信授权的手机号
  getPhoneNumber(e) {
    if (e.detail.iv == undefined) {
      util.showErrorModal("您拒绝了授权！请重新点击并确认授权…");
      return;
    }
    var sessionId = wx.getStorageSync("fc_wxopem_sessionId");
    var that = this;
    //提交绑定手机号
    api.WxGetPhoneNumber({
      data: {
        encryptedData: e.detail.encryptedData,
        sessionId: sessionId,
        uid: that.data.userInfo.id,
        iv: e.detail.iv,
        errMsg: e.detail.errMsg
      },
      method: "POST",
      success: (res) => {
        if (res.data.StatusCode == 200) {
          util.showSuccessModal("绑定手机号成功！");
          app.globalData.userInfo = res.data.Data;
          //更新用户存储缓存
          wx.setStorageSync("fc_card_ulogin", res.data.Data);
          //绑定成功跳转到支付页面
          setTimeout(function () {
            that.toPay();
          }, 1000);
        } else {
          util.showErrorModal(res.data.Data);
        }
      }
    });
  }
});
