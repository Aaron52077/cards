// pages/main/case_detail/detail.js
const api = require("api.js");
const App = getApp();
import util from "../../../utils/util.js";
const formatUrl = util.formatUrl;

Page({
  data: {
    getCaseDetail: {},
    getDailyList: {},
    uid: 0,
    isActive: false,
    flag: true,
    isHidden: false,
    userInfo: {},
    id: 0 //案例id
  },
  onLoad: function (options) {
    var self = this;
    const typeId = options.id;
    const isownAdd = options.isown;
    wx.showToast({
      title: "正在加载",
      icon: "loading",
      duration: 5000
    });
    // 获取用户信息
    self.setData({
      userInfo: App.globalData.userInfo,
      id: typeId
    });
    api.getCaseDetail({
      data: {
        id: typeId,
        isOwn: isownAdd
      },
      success: (res) => {
        self.setData({
          getCaseDetail: res.data.Data
        });
        // 设置当前案例页面标题 接收参数
        wx.setNavigationBarTitle({
          title: `${res.data.Data.name}案例详情`
        });
      }
    });
    api.getDailyList({
      data: {
        id: typeId,
        isOwnAdd: isownAdd
      },
      success: (res) => {
        self.setData({
          getDailyList: res.data.Data
        });
        wx.hideToast();
      }
    });
  },
  onShow: function () {
    setTimeout((res) => {
      var loginInfo = App.globalData.userInfo,
        current_id = App.globalData.visitUserInfo.id;
      if (current_id != 0) {
        //添加足迹
        api.HandleFootPrint({
          data: {
            cid: current_id,
            info: `用户【${loginInfo.name}】浏览了你的案例 ${this.data.getCaseDetail.name}`,
            type: 7,
            url: "pages/main/case_detail/detail?id=" + this.data.id
          },
          method: "post",
          success: (res) => {
            console.log(res);
          }
        });
      }
    }, 2500);
  },
  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: `【揭密】${that.data.caseDetailDesc.name}这套房子原来是这样装出来的？`, // 默认是小程序的名称(可以写slogan等)
      path: `/pages/case/detail/index?id=${that.data.caseDetailDesc.id}`, // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: that.data.caseDetailDesc.cover, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == "shareAppMessage:ok") {
          api.wxShareRecord({
            method: "POST",
            data: {
              uid: that.data.userInfo.id,
              title: shareObj.title,
              imgUrl: shareObj.imgUrl,
              links: shareObj.path,
              desc: ""
            },
            success: (resquest) => {
              // 成功提示
              wx.showToast({
                title: resquest.data.Data,
                icon: "success",
                duration: 2000
              });
              console.log(resquest);
            }
          });
        }
      },
      fail: function (res) {
        // 转发失败之后的回调
        if (res.errMsg == "shareAppMessage:fail cancel") {
          // 用户取消转发
        } else if (res.errMsg == "shareAppMessage:fail") {
          // 转发失败，其中 detail message 为详细失败信息
        }
      }
    };
    // 来自页面内的按钮的转发
    if (options.from == "button") {
    }
    // 返回shareObj
    return shareObj;
  },
  showToggle: function () {
    this.setData({ flag: false });
  },
  hideToggle: function () {
    this.setData({ flag: true });
  },
  collectHandle(e) {
    let self = this;
    const id = parseInt(e.currentTarget.dataset.id);
    // 收藏对象
    api.addCollection({
      method: "POST",
      data: { uid: self.data.userInfo.id, type: 1, expandId: id },
      success: (res) => {
        // 成功提示
        wx.showToast({
          title: res.data.Data,
          icon: "success",
          duration: 2000
        });
        self.setData({
          isHidden: true
        });
      }
    });
  },
  // 点击评论输入框聚焦
  bindButtonTap: function () {
    this.setData({
      focus: true
    });
  },
  // 获取输入框内容
  inputHandle: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  // 针对uid评论
  comment: function (e) {
    const uid = e.currentTarget.id;
    const nikeName = e.currentTarget.dataset.name;
    const index = e.currentTarget.dataset.index;
    this.setData({
      focus: true
    });
  },
  // 发送评论
  submitHandle: function (e) {
    const nikeName = e.currentTarget.dataset.name;
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.pid;
    api.addReplyDiary({
      method: "POST",
      data: { uid: this.userInfo.id, cid: parseInt(id), pid: index, name: nikeName, info: this.data.inputValue },
      success: (res) => {
        // 成功提示
        wx.showToast({
          title: "评论成功",
          icon: "success",
          duration: 2000
        });
        this.setData({
          indexNum: "",
          focus: false
        });
      }
    });
  },
  //隐藏弹框
  hideDialog() {
    this.setData({
      isShow: !this.data.isShow
    });
  },
  // 图片相册
  previewImage: function (e) {
    const current = e.currentTarget.dataset.src;
    const atlas = e.currentTarget.dataset.atlas;
    let arrImg = [];
    atlas.forEach((item) => {
      arrImg.push(formatUrl(item));
    });
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: arrImg // 需要预览的图片http链接列表
    });
  },
  // 切换评论点赞显示隐藏
  toggleHanle: function (e) {
    const idx = e.currentTarget.dataset.index;
    if (this.data.indexNum === "") {
      this.setData({
        indexNum: idx
      });
    } else {
      this.setData({
        indexNum: ""
      });
    }
    this.setData({
      focus: false
    });
  },
  // 点赞
  coolHandle: function (e) {
    let self = this;
    const id = e.currentTarget.dataset.id;
    if (id) {
      api.diarysPraiseCount({
        query: {
          id: id
        },
        success: (res) => {
          wx.showToast({
            title: "点赞成功",
            icon: "success",
            duration: 2000
          });
          self.setData({
            indexNum: ""
          });
        }
      });
    }
    api.getDailyList({
      data: {
        id: self.properties.cid,
        pageindex: self.data.pageindex
      },
      success: (res) => {
        self.setData({
          getDailyList: res.data.Data,
          totalpage: res.data.TotalPage
        });
      }
    });
  },
  // 点击评论输入框聚焦
  bindButtonTap: function () {
    this.setData({
      focus: true
    });
  },
  // 获取输入框内容
  inputHandle: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  // 针对uid评论
  comment: function (e) {
    const uid = e.currentTarget.id;
    const nikeName = e.currentTarget.dataset.name;
    const index = e.currentTarget.dataset.index;
    this.setData({
      focus: true
    });
  },
  // 发送评论
  submitHandle: function (e) {
    const nikeName = e.currentTarget.dataset.name;
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.pid;
    api.addReplyDiary({
      method: "POST",
      data: { uid: this.userInfo.id, cid: parseInt(id), pid: index, name: nikeName, info: this.data.inputValue },
      success: (res) => {
        // 成功提示
        wx.showToast({
          title: "评论成功",
          icon: "success",
          duration: 2000
        });
        this.setData({
          indexNum: "",
          focus: false
        });
      }
    });
  }
});
