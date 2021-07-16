// pages/main/activity_sign/sign.js
const api = require("api.js");

Page({
  data: {
    formData: {
      title: "名片小程序-免费报价",
      url: "/pages/quoted/index",
      tel: "",
      name: "",
      style: "",
      money: "",
      type: "",
      area: "",
      unit: "",
      property: ""
    }
  },
  onLoad: function (options) {
    var self = this;
    self.setData({
      formData: {
        title: "小程序免费设计-" + options.title,
        url: options.url,
        tel: "",
        name: "",
        style: "",
        money: "",
        type: "新房装修",
        area: "",
        unit: "",
        property: ""
      }
    });
  },
  formSubmit: function (e) {
    const self = this;
    var phone = e.detail.value.tel;
    var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: "请输入正确的手机号码！",
        icon: "none",
        duration: 1000
      });
      return false;
    }
    api.submitSignup({
      data: {
        uid: 0,
        url: self.data.formData.url,
        title: self.data.formData.title,
        tel: phone,
        name: e.detail.value.name,
        style: self.data.formData.style,
        money: self.data.formData.money,
        type: self.data.formData.unit,
        area: e.detail.value.area,
        property: e.detail.value.property,
        pid: 0
      },
      method: "POST",
      success: (res) => {
        //弹窗提示
        wx.showToast({
          title: res.data.Data,
          icon: "none",
          duration: 3000
        });
      }
    });
  },
  onShareAppMessage: function () {}
});
