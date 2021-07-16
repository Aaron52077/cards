// pages/main/atlas_gallery/list.js
const api = require("api.js");
const app = getApp();

Page({
  data: {
    gallery: {
      current: 0
    },
    urls: [],
    title: "",
    id: 0
  },
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    if (id) {
      //编辑
      var data = {
        id: id
      };
      api.getDetail({
        data,
        success: (res) => {
          that.setData({
            urls: res.data.Data.arr_Atlas,
            id: id,
            title: res.data.Data.info
          });
          wx.setNavigationBarTitle({
            title: res.data.Data.title
          });
        }
      });
    }
  },
  onShow: function () {
    setTimeout((res) => {
      var loginInfo = app.globalData.userInfo,
        current_id = app.globalData.visitUserInfo.id;
      if (current_id != 0) {
        //添加足迹
        api.HandleFootPrint({
          data: {
            cid: current_id,
            info: `用户【${loginInfo.name}】浏览了你的图集 ${this.data.title}`,
            type: 2,
            url: "pages/main/atlas_gallery/list?id=" + this.data.id
          },
          method: "post",
          success: (res) => {
            console.log(res);
          }
        });
      }
    }, 2500);
  },
  bindchange(e) {
    this.setData({
      [`gallery.current`]: e.detail.current
    });
  },
  previewImage(e) {
    const dataset = e.currentTarget.dataset;
    const current = dataset.current;
    const urls = this.data.urls;

    wx.previewImage({
      current: current,
      urls: urls
    });
  }
});
