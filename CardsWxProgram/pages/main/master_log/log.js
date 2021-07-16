// pages/main/master_log/log.js
const app = getApp();
const api = require("api.js");
const fcglobal = require("../../../utils/api.js");
const util = require("../../../utils/util.js");

Page({
  data: {
    textAreaDesc: "",
    placeholderText: "至少5个字嘛!",
    min: 5,
    max: 125,
    tagIndex: null,
    atlasList: [],
    placehoder: "请填写相关施工日志哦~",
    filter_stages: wx.getStorageSync("filter_stages"),
    statusIndex: 1,
    isdisable: false, //是否禁用
    formdata: {
      id: 0,
      cid: 0,
      uid: 0,
      status: 1,
      info: "",
      longitude: "",
      latitude: "",
      address: "",
      altas: ""
    },
    hasLocation: false
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      ["formdata.cid"]: options.id,
      ["formdata.uid"]: app.globalData.userInfo.id
    });
  },
  //提交
  formSubmit: function (event) {
    this.setData({
      isdisable: true
    });
    if (event.detail.value.info == "") {
      util.showTextModal("日志内容不能为空");
      this.setData({
        isdisable: false
      });
      return false;
    }
    if (this.data.atlasList.length == 0) {
      util.showTextModal("日志图集不能为空");
      this.setData({
        isdisable: false
      });
      return false;
    }
    this.setData({
      ["formdata.info"]: event.detail.value.info,
      ["formdata.altas"]: this.data.atlasList.join(",")
    });

    var data = this.data.formdata;
    api.WriteLog({
      data,
      method: "post",
      success: (res) => {
        if (res.data.StatusCode == 200) {
          util.showSuccessModal("添加成功");
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/main/case_detail/detail?id=${data.cid}&isown=true`
            });
          }, 2000);
        }
      }
    });
  },
  //下拉切换
  bindSelectChange(e) {
    this.setData({
      ["formdata.status"]: e.detail.value,
      statusIndex: e.detail.value
    });
  },
  //字数限制
  textareaHanle(e) {
    let value = e.detail.value;
    let len = parseInt(value.length);
    //最少字数限制
    if (len <= this.data.min)
      this.setData({
        placeholderText: "请您多多填写相关施工日志哦~"
      });
    else if (len > this.data.min)
      this.setData({
        placeholderText: ""
      });

    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      totalNum: len //当前字数
    });
  },
  //添加图片
  choseImage() {
    var that = this;
    wx.chooseImage({
      count: 10, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: "正在上传图片..."
        });
        res.tempFilePaths.forEach(function (imgPath) {
          wx.uploadFile({
            url: fcglobal.uploadserverUrl, //服务器接收地址
            filePath: imgPath,
            name: "files",
            formData: {
              folder: "cases"
            },
            success: function (e) {
              var data = JSON.parse(e.data);
              that.setData({
                atlasList: that.data.atlasList.concat(data.url)
              });
              wx.hideLoading();
            }
          });
        });
      }
    });
  },
  delHandle(e) {
    const index = e.currentTarget.dataset.index;
    let Atlas = this.data.atlasList;
    Atlas.splice(index, 1);
    this.setData({
      atlasList: Atlas
    });
  },
  //选择地址
  getLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          hasLocation: true,
          [`formdata.longitude`]: res.longitude,
          [`formdata.latitude`]: res.latitude,
          [`formdata.address`]: res.address
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
                              [`formdata.longitude`]: res.longitude,
                              [`formdata.latitude`]: res.latitude,
                              [`formdata.address`]: res.address
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
  }
});
