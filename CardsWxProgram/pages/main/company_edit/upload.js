// pages/main/company_edit/upload.js
import { Field } from "../../../components/index";

Page(
  Object.assign({}, Field, {
    data: {
      tel: {
        error: true,
        title: "电话",
        inputType: "tel",
        placeholder: "请输入公司电话",
        componentId: "companyTel"
      },
      hasLocation: false,
      companyName: "",
      companyTel: "",
      companyAddress: ""
    },
    onLoad: function (options) {},
    handleWuliFieldChange(e) {
      //const { componentId, detail } = e;
    },
    formSubmit(event) {
      console.log("[wuli:field:submit]", event.detail.value);
    },
    chooseLocation: function () {
      var that = this;
      wx.chooseLocation({
        success: function (res) {
          that.setData({
            hasLocation: true,
            companyAddress: res.address
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
                                companyAddress: res.address
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
    },
    //上传图片
    chooseImage: function (e) {
      var that = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
        }
      });
    }
  })
);
