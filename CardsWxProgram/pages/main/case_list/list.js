// pages/main/case_list/list.js
const app = getApp();
const api = require("api.js");
const util = require("../../../utils/util.js");

Page({
  data: {
    PagedListData: [],
    searchCondition: {
      PageIndex: 1,
      uid: 0, //用户id
      keyword: ""
    },
    loading: false,
    totalpage: 0,
    windowsHeight: app.globalData.systemInfo.windowHeight, //设备高度
    currentId: 0, //当前操作的id

    cur_uid: 0, //当前用户id
    userInfo: null,
    showBottomPopup: false,
    currentIndex: null,
    currentIsOwnAdd: false, //当前操作的案例是否为公司的案例
    menuPopup: false
  },
  onLoad: function (options) {
    var that = this;
    var uinfo = app.globalData.userInfo;
    if (uinfo == null) {
      uinfo = {
        id: 0
      }; //表示未登录用户
    }
    var cur_uid = uinfo.id;
    if (options.curuid) {
      cur_uid = options.curuid;
    }
    that.setData({
      cur_uid: cur_uid,
      userInfo: uinfo,
      ["searchCondition.uid"]: cur_uid
    });
  },
  onShow: function () {
    this.initPage();
    setTimeout((res) => {
      if (this.data.cur_uid != this.data.userInfo.id) {
        //添加足迹
        api.HandleFootPrint({
          data: {
            cid: this.data.cur_uid,
            info: `用户【${this.data.userInfo.name}】浏览了你的案例列表`,
            type: 4,
            url: "pages/main/case_list/list?curuid=" + this.data.cur_uid
          },
          method: "post",
          success: (res) => {}
        });
      }
    }, 2500);
  },
  onHide: function () {
    this.setData({
      menuPopup: false
    });
  },
  initPage: function () {
    var that = this;
    that.setData({
      ["searchCondition.PageIndex"]: 1
    });
    var data = that.data.searchCondition;
    api.getPagedList({
      data,
      success: (res) => {
        that.setData({
          PagedListData: res.data.Data,
          totalpage: res.data.TotalPage,
          loading: res.data.TotalPage <= 1 ? false : true
        });
      }
    });
  },
  //滚动距底部50触发事件
  loadMore: function () {
    var that = this;
    if (that.data.searchCondition.PageIndex >= that.data.totalpage) {
      that.setData({
        loading: false
      });
      return;
    }
    that.setData({
      loading: true,
      ["searchCondition.PageIndex"]: that.data.searchCondition.PageIndex + 1
    });
    var data = that.data.searchCondition;
    api.getPagedList({
      data,
      success: (res) => {
        that.setData({
          PagedListData: that.data.PagedListData.concat(res.data.Data),
          totalpage: res.data.TotalPage
        });
      }
    });
  },
  //关键字搜索
  bindconfirm(e) {
    var that = this;
    that.setData({
      loading: false,
      ["searchCondition.keyword"]: e.detail.value,
      ["searchCondition.PageIndex"]: 1
    });
    that.initPage();
  },
  goCaseDetail(e) {
    const id = e.currentTarget.dataset.id,
      isOwnAdd = e.currentTarget.dataset.isownadd;
    wx.navigateTo({
      url: `/pages/main/case_detail/detail?id=${id}&isown=${isOwnAdd}`
    });
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  //弹出Popup
  thumbHanle(e) {
    // 索引值
    const index = e.currentTarget.dataset.index,
      isOwnAdd = e.currentTarget.dataset.isownadd;
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      currentIndex: index,
      currentId: e.currentTarget.dataset.id,
      currentIsOwnAdd: isOwnAdd
    });
  },
  //编辑
  handleEdit() {
    if (this.data.currentIsOwnAdd) {
      wx.navigateTo({
        url: `/pages/main/case_edit/upload?id=${this.data.currentId}&isown=${this.data.currentIsOwnAdd}`
      });
    } else {
      util.showTextModal("当前案例为公司案例，不能编辑");
      this.setData({
        showBottomPopup: !this.data.showBottomPopup
      });
    }
  },
  //删除
  handleDel() {
    var that = this;
    wx.showModal({
      content: "你确定要删除该案例？？",
      confirmText: "确定",
      cancelText: "取消",
      success: (b) => {
        if (b.confirm) {
          api.Remove({
            data: {
              id: that.data.currentId,
              type: 1,
              isOwnAdd: this.data.currentIsOwnAdd
            },
            method: "post",
            success: (res) => {
              that.data.PagedListData.splice(that.data.currentIndex, 1),
                that.setData({
                  showBottomPopup: !that.data.showBottomPopup,
                  PagedListData: that.data.PagedListData
                });
              util.showSuccessModal("删除成功");
            }
          });
        }
      }
    });
  },
  toggleMenuPopup() {
    this.setData({
      menuPopup: !this.data.menuPopup
    });
  },
  addHandle() {
    // 企业版用户，则跳转到快速添加页面
    if (this.data.userInfo.cardCompanyId == 0) {
      // 非企业版用户，则跳转到企业版介绍页面
      wx.navigateTo({
        url: "/pages/main/rank_version/version"
      });
    } else {
      wx.navigateTo({
        url: "/pages/main/case_fast/list"
      });
    }
  }
});
