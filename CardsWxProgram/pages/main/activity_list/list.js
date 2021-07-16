// pages/main/activity_list/list.js
const api = require("api.js");
const util = require("../../../utils/util.js");
const app = getApp();

Page({
  data: {
    ActivityList: [],
    showBottomPopup: false,
    currentIndex: null,
    searchCondition: {
      PageIndex: 1,
      uid: 0, //用户id
      keyword: ""
    },
    loading: false,
    totalpage: 0,
    cur_uid: 0,
    uinfo: null,
    type1: "",
    currentId: 0, //操作id
    currentIndex: 0 //操作索引
  },
  onLoad: function (options) {
    var uinfo = app.globalData.userInfo;
    var cur_uid = uinfo.id;
    if (options.curuid) {
      cur_uid = options.curuid;
    }
    this.setData({
      uinfo: uinfo,
      cur_uid: cur_uid
    });
    this.setData({
      cur_uid: cur_uid,
      uinfo: uinfo,
      ["searchCondition.uid"]: cur_uid
    });
  },
  onShow: function () {
    this.initPage();
    setTimeout((res) => {
      if (this.data.cur_uid != this.data.uinfo.id) {
        //添加足迹
        api.HandleFootPrint({
          data: {
            cid: this.data.cur_uid,
            info: `用户【${this.data.uinfo.name}】浏览了你的活动列表`,
            type: 6,
            url: "pages/main/activity_list/list?curuid=" + this.data.cur_uid
          },
          method: "post",
          success: (res) => {
            console.log(res);
          }
        });
      }
    }, 2500);
  },
  initPage: function () {
    var that = this;
    var data = that.data.searchCondition;
    api.GetActivityList({
      data,
      success: (res) => {
        if (res.data.StatusCode == 200) {
          that.setData({
            ActivityList: res.data.Data,
            totalpage: res.data.TotalPage,
            loading: res.data.TotalPage <= 1 ? false : true
          });
        }
      }
    });
  },
  //滚动距底部50触发事件
  loadMore: function () {
    var that = this;
    if (self.data.searchCondition.PageIndex >= self.data.totalpage) {
      self.setData({
        loading: false
      });
      return;
    }
    that.setData({
      loading: true,
      ["searchCondition.PageIndex"]: that.data.searchCondition.PageIndex + 1
    });
    var data = that.data.searchCondition;
    api.GetActivityList({
      data,
      success: (res) => {
        that.setData({
          ActivityList: that.data.ActivityList.concat(res.data.Data),
          totalpage: res.data.TotalPage
        });
      }
    });
  },
  thumbHanle(e) {
    // 索引值
    const id = e.currentTarget.dataset.id,
      type1 = e.currentTarget.dataset.type;
    const index = e.currentTarget.dataset.index;
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      currentId: id,
      type1: type1,
      currentIndex: index
    });
  },
  handleDel() {
    //删除
    var that = this;
    wx.showModal({
      content: "你确定要删除该活动？？",
      confirmText: "确定",
      cancelText: "取消",
      success: (b) => {
        if (b.confirm) {
          api.ActivityDel({
            data: { id: that.data.currentId },
            method: "post",
            success: (res) => {
              if (res.data.StatusCode === 200) {
                that.data.ActivityList.splice(that.data.currentIndex, 1),
                  that.setData({
                    showBottomPopup: !that.data.showBottomPopup,
                    ActivityList: that.data.ActivityList
                  });
                that.showSuccessModal("删除成功");
              }
            }
          });
        }
      }
    });
  },
  handledit() {
    if (this.data.type1 == "company") {
      util.showTextModal("公司创建的活动，暂无编辑权限！");
      this.setData({
        showBottomPopup: !this.data.showBottomPopup
      });
    } else {
      wx.navigateTo({
        url: `/pages/main/activity_edit/upload?id=${this.data.currentId}&type=${this.data.type1}`
      });
    }
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  addHanle() {
    wx.navigateTo({
      url: "/pages/main/activity_edit/upload"
    });
  }
});
