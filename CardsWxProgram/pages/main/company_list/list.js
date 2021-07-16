// pages/main/company_list/list.js
const app = getApp();
const api = require("api.js");
const util = require("../../../utils/util.js");
Page({
  data: {
    markers: [],
    companyId: 0,
    companyInfo: 0
  },
  onLoad: function (options) {
    this.setData({
      companyId: app.globalData.userInfo.cardCompanyId
    });

    if (this.data.cardCompanyId == 0) {
      return false;
    } else {
      api.GetBindCompanyInfo({
        data: {},
        success: (res) => {
          var companyInfo = res.data.Data;
          var markers = [
            {
              latitude: parseFloat(companyInfo.latitude),
              longitude: parseFloat(companyInfo.longitude),
              name: companyInfo.name,
              iconPath: "/image/location.png"
            }
          ];
          this.setData({
            companyInfo: companyInfo,
            markers: markers
          });
        }
      });
    }
  },
  //拨打电话
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    });
  },
  Visitingline(e) {
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      scale: 16,
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    });
  },
  handleRemoveCompany() {
    wx.showModal({
      content: "你确定要解除该企业关联吗？？",
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          api.RemoveCompnayWithCard({
            method: "post",
            success: (res) => {
              if (res.data.StatusCode == 200) {
                util.showSuccessModal("解除关联成功！");
                setTimeout(() => {
                  wx.navigateTo({
                    url: "/pages/main/user/user"
                  });
                }, 1500);
              }
            }
          });
        }
      }
    });
  }
});
