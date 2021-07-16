// pages/main/master_list/list.js
const app = getApp();
const api = require("api.js");
const util = require("../../../utils/util.js");
Page({
  data: {
    showBottomPopup: false,
    menuPopup: false,
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
    currentIndex: 0,
    cur_uid: 0, //当前用户id
    userInfo: null,
    currentIsOwnAdd: false //当前操作的案例是否为公司的案例
  },
  onLoad: function (options) {
    var that = this;
    var uinfo = app.globalData.userInfo;
    var cur_uid = uinfo.id;
    if (options.curuid) {
      cur_uid = options.curuid;
    }
    that.setData({
      cur_uid: cur_uid,
      userInfo: uinfo,
      ["searchCondition.uid"]: cur_uid
    });
    that.initFunc();
  },
  onShow: function () {
    this.initFunc();
    setTimeout((res) => {
      if (this.data.cur_uid != this.data.userInfo.id) {
        //添加足迹
        api.HandleFootPrint({
          data: {
            cid: this.data.cur_uid,
            info: `用户【${this.data.userInfo.name}】浏览了你的在建工地列表`,
            type: 3,
            url: "pages/main/master_list/list?curuid=" + this.data.cur_uid
          },
          method: "post",
          success: (res) => {
            console.log(res);
          }
        });
      }
    }, 2500);
  },
  onHide: function () {
    this.setData({
      menuPopup: false
    });
  },
  initFunc: function () {
    var that = this;
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
  onReady: function () {},
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
        var rdata = that.data.PagedListData.concat(res.data.Data);
        that.setData({
          PagedListData: rdata,
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
      ["searchCondition.keyword"]: e.detail.value
    });
    that.initFunc();
  },
  //弹出操作层
  thumbHanle(e) {
    // 索引值
    var isOwnAdd = e.currentTarget.dataset.isownadd;
    this.setData({
      showBottomPopup: !this.data.showBottomPopup,
      currentId: e.currentTarget.dataset.id,
      currentIndex: e.currentTarget.dataset.index,
      currentIsOwnAdd: isOwnAdd
    });
  },
  //设为案例
  handleSetCase() {
    var that = this;
    var ali = that.data.PagedListData[that.data.currentIndex].status;
    if (ali != "入住阶段" || ali != "入住阶段") {
      util.showTextModal("当工地状态为竣工或者入住阶段时才能被设置为案例");
      that.setData({
        showBottomPopup: !that.data.showBottomPopup
      });
      return false;
    }
    var curid = that.data.currentId;
    wx.showModal({
      content: "你确定将该在建工地设为案例吗 ？？",
      confirmText: "确定",
      cancelText: "取消",
      success: (b) => {
        if (b.confirm) {
          //跳转到案例信息编辑页面
          wx.navigateTo({
            url: "/pages/main/case_edit/upload?id=" + curid
          });
        }
      }
    });
  },
  //删除
  handleDelCase() {
    var that = this;
    wx.showModal({
      content: "你确定要删除该案例？？",
      confirmText: "确定",
      cancelText: "取消",
      success: (b) => {
        if (b.confirm) {
          var data = {
            id: that.data.currentId,
            type: 2,
            isOwnAdd: this.data.currentIsOwnAdd
          };
          api.delCase({
            data,
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
  //编辑
  handelEdit() {
    if (this.data.currentIsOwnAdd) {
      wx.navigateTo({
        url: `/pages/main/master_edit/upload?id=${this.data.currentId}&isown=${this.data.currentIsOwnAdd}`
      });
    } else {
      util.showTextModal("当前工地为公司的在建工地，不能编辑");
      this.setData({
        showBottomPopup: !this.data.showBottomPopup
      });
    }
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },
  toggleMenuPopup() {
    this.setData({
      menuPopup: !this.data.menuPopup
    });
  },
  // 跳转到日志编辑页
  handleLog(e) {
    if (this.data.currentIsOwnAdd) {
      wx.navigateTo({
        url: `/pages/main/master_log/log?id=${this.data.currentId}`
      });
    } else {
      util.showTextModal("当前工地为公司的在建工地，不能添加日志");
      this.setData({
        showBottomPopup: !this.data.showBottomPopup
      });
    }
  },
  goCaseDetail(e) {
    const id = e.currentTarget.dataset.id,
      isOwnAdd = e.currentTarget.dataset.isownadd;
    console.log(isOwnAdd);
    wx.navigateTo({
      url: `/pages/main/case_detail/detail?id=${id}&isown=${isOwnAdd}`
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
        url: "/pages/main/master_fast/list"
      });
    }
  }
});
