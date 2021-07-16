import { Field } from "../../../components/index";
import config from "./config";
const fcglobal = require("../../../utils/api.js");
const util = require("../../../utils/util.js");
const api = require("api.js");
const app = getApp();

Page(
  Object.assign({}, Field, {
    data: {
      userInfo: null,
      config,
      name: "",
      cardphotoMax: "",
      cardphotomin: "",
      position: "",
      goodat: "",
      wechatNum: "",
      phone: "",
      companyname: "",
      companyTel: "",
      companyAddress: "",
      introduction: "",
      companylogo: "",
      uid: 0,
      hasLocation: false,
      longitude: 0,
      latitude: 0,
      index: 3,
      opened: !1,
      uinfo: {}
    },
    onLoad: function () {
      var that = this;
      //当前登录的用户信息含支付后
      api.getLoginedUInfo({
        success: (res) => {
          if (res.data.StatusCode == 200) {
            var uinfo = res.data.Data;
            app.globalData.userInfo = uinfo;
            that.setData({
              userInfo: uinfo,
              uid: uinfo.id,
              name: uinfo.name,
              cardphotoMax: uinfo.cardphotoMax,
              position: uinfo.position,
              goodat: uinfo.goodat,
              wechatNum: uinfo.wechatNum,
              phone: uinfo.phone,
              companyname: uinfo.companyname,
              introduction: uinfo.introduction,
              companylogo: uinfo.companylogo,
              cardphotomin: uinfo.cardphotomin,
              companyAddress: uinfo.companyAddress,
              companyTel: uinfo.companyTel,
              latitude: uinfo.latitude,
              longitude: uinfo.longitude
            });
            // 支付费用
            if (uinfo.cardtype == 0) {
              wx.navigateTo({
                url: "/pages/start/version/version"
              });
              return;
            }
          }
        }
      });
    },
    //上传图片
    chooseImage: function (e) {
      var that = this;
      const cmd = e.currentTarget.dataset.cmd;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          //上传
          wx.uploadFile({
            url: fcglobal.uploadPath, //图片接口
            filePath: tempFilePaths[0],
            name: "file",
            formData: {
              folder: "mAvatar"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              if (data.StatusCode === 200) {
                if (cmd == "avatar") {
                  that.setData({
                    cardphotoMax: data.Data.src.replace("_ms", "_mx"),
                    cardphotomin: data.Data.src.replace("_ms", "_mx")
                  });
                } else {
                  //logo
                  that.setData({
                    companylogo: data.Data.src.replace("_ms", "_mx")
                  });
                }
              }
            }
          });
        }
      });
    },
    handleWuliFieldChange(e) {
      switch (e.componentId) {
        case "name":
          {
            this.setData({
              name: e.detail.value
            });
          }
          break;
        case "position":
          {
            this.setData({
              position: e.detail.value
            });
          }
          break;
        case "goodat":
          {
            this.setData({
              goodat: e.detail.value
            });
          }
          break;
        case "wechatNum":
          {
            this.setData({
              wechatNum: e.detail.value
            });
          }
          break;
        case "phone":
          {
            this.setData({
              phone: e.detail.value
            });
          }
          break;
        case "companyname":
          {
            this.setData({
              companyname: e.detail.value
            });
          }
          break;
        case "companyTel":
          {
            this.setData({
              companyTel: e.detail.value
            });
          }
          break;
        default:
          {
            if (e.currentTarget.id == "companyname") {
              this.setData({
                companyname: e.detail.value
              });
            }
            if (e.currentTarget.id == "introduction") {
              this.setData({
                introduction: e.detail.value
              });
            }
          }
          break;
      }
    },
    handleWuliFieldFocus(e) {
      //const { componentId, detail } = e;
      console.log(e.detail.height);
    },
    handleWuliFieldBlur(e) {
      // const { componentId, detail } = e;
    },
    formSubmit(event) {
      var data = {
        name: this.data.name,
        cardphotoMax: this.data.cardphotoMax,
        cardphotomin: this.data.cardphotomin,
        position: this.data.position,
        goodat: this.data.goodat,
        wechatNum: this.data.wechatNum,
        phone: this.data.phone,
        companyname: this.data.companyname,
        introduction: this.data.introduction,
        companylogo: this.data.companylogo,
        uid: this.data.uid,
        companyAddress: this.data.companyAddress,
        companyTel: this.data.companyTel,
        latitude: this.data.latitude,
        longitude: this.data.longitude
      };
      if (this.data.name == "") {
        util.showErrorModal("姓名不能为空");
        return false;
      }
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(this.data.phone)) {
        util.showErrorModal("手机号格式错误");
        return false;
      }
      if (this.data.cardphotoMax == "") {
        util.showErrorModal("名片头像不能为空");
        return false;
      }
      if (this.data.position == "") {
        util.showErrorModal("职位不能为空");
        return false;
      }
      if (this.data.companyAddress == "") {
        util.showErrorModal("公司地址不能为空");
        return false;
      }
      //提交
      api.createCard({
        data,
        method: "post",
        success: (res) => {
          if (res.data.StatusCode === 200) {
            util.showSuccessModal("创建成功!");
            app.globalData.userInfo = res.data.Data;
            setTimeout((res) => {
              wx.redirectTo({
                url: "/pages/start/index"
              });
            }, 2000);
          }
        }
      });
    },
    //选择地址
    chooseLocation: function () {
      var that = this;
      wx.chooseLocation({
        success: function (res) {
          that.setData({
            hasLocation: true,
            companyAddress: res.address,
            longitude: res.longitude,
            latitude: res.latitude
          });
        },
        fail: function () {
          wx.getSetting({
            success: function (res) {
              var status = res.authSetting;
              if (!status["scope.userLocation"]) {
                wx.showModal({
                  title: "是否授权当前位置",
                  content: "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
                  success: function (tip) {
                    if (tip.confirm) {
                      wx.openSetting({
                        success: function (request) {
                          request.authSetting = {
                            "scope.userLocation": true
                          };
                          //授权成功之后，再调用chooseLocation选择地方
                          wx.chooseLocation({
                            success: function (res) {
                              that.setData({
                                hasLocation: true,
                                companyAddress: res.address,
                                longitude: res.longitude,
                                latitude: res.latitude
                              });
                            }
                          });
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
    },
    goCersion() {
      wx.navigateTo({
        url: "/pages/main/rank_version/version"
      });
    }
  })
);
