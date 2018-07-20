//index.js
//获取应用实例
const app = getApp();
import {
  Button
} from '../../components/index';

const api = require('api.js');
const util = require('../../utils/util.js');

Page({
  data: {
    marginRange: '102rpx', // 左右边距露出范围
    userInfo: null,
    currentDots: 1,
    indicator: [0, 1, 2],
    defaultData: true, // 无名片
    index: 3,
    opened: !1,
    isOpen: false,
    IndexFolderUser: [],
    myUserNum: 0,
    UnReadMsgNum: 0,
  },
  onLoad: function(options) {
    this.initButton()
  },
  onShow: function() {
    wx.showLoading({
      title: '拼命加载中',
    })
    var self = this;
    var uinfo = app.globalData.userInfo;
    if (uinfo == null) {
      setTimeout(res => {
        var uinfo = app.globalData.userInfo;
        self._setUinfo(uinfo);
        wx.hideLoading()
      }, 1600);
    } else {
      self._setUinfo(uinfo);
      wx.hideLoading()
    }
    var openValue = wx.getStorageSync('isOpen');
    if (openValue && openValue == true) {
      wx.removeStorageSync('isOpen')
      this.setData({
        isOpen: false
      })
    }
  },
  _setUinfo: function(uinfo) {
    this.setData({
      userInfo: uinfo
    })
    if (uinfo != null && uinfo.cardphotoMax != "" && uinfo.cardphotoMax != undefined) {
      this.setData({
        defaultData: false
      })
    }
    if (uinfo != null) {
      this.IndexFolderUser();
    }
  },
  IndexFolderUser() {
    api.GetIndexUser({
      success: (res) => {
        var hasCount = res.data.Data.GroupUsers.length
        let Arr = res.data.Data.GroupUsers
        // 数组长度默认为8
        for (var i = 0; i < 8 - hasCount; i++) {
          var obj = {
            id: i
          };
          Arr.push(obj)
        }
        this.setData({
          IndexFolderUser: Arr,
          myUserNum: res.data.TotalPage,
          UnReadMsgNum: res.data.Data.UnReadMsgNum
        })
      }
    });
  },
  onHide: function() {
    var openValue = wx.getStorageSync('isOpen');
    if (openValue && openValue == true) {
      this.setData({
        isOpen: false
      })
    }
  },
  toLogin: function() {
    // 前往授权登录界面
    wx.navigateTo({
      url: '/pages/login/index'
    });
  },
  goMain() {
    wx.navigateTo({
      url: "/pages/main/index?curuid=" + this.data.userInfo.id,
    })
  },
  toPay: function() {
    // 支付费用
    wx.navigateTo({
      url: '/pages/start/version/version'
    });
  },
  toBindPhone: function() {
    // 绑定手机号
    wx.navigateTo({
      url: '/pages/login/bindphone/index'
    });
  },
  bindChange: function(e) {
    var that = this;
    if (e.detail.source) {
      that.setData({
        currentDots: e.detail.current,
        isOpen: false
      });
      that.data.isOpen ? this.button.open() : this.button.close()
    }
  },
  swichNav: function(e) {
    var that = this;
    that.setData({
      currentDots: e.target.dataset.current
    });
  },
  newCardHanle() {
    if (this.data.userInfo == null) {
      // 前往授权登录界面
      wx.navigateTo({
        url: '/pages/login/index'
      });
      return;
    }
    //未支付费用 跳转
    if (this.data.userInfo.cardtype == 0) {
      this.toPay();
    } else {
      wx.navigateTo({
        url: `/pages/start/add/add`
      })
    }
  },
  exitHanle() {
    wx.navigateTo({
      url: `/pages/login/index`
    })
  },
  //点击弹出  
  plus(e) {
    let self = this;
    self.setData({
      isOpen: !self.data.isOpen
    })
    self.data.isOpen ? this.button.open() : this.button.close()
    wx.setStorageSync('isOpen', self.data.isOpen)
  },
  initButton(position = 'center') {
    let self = this;
    this.setData({
      opened: !1,
    })
    this.button = Button.init('br', {
      position: position,
      buttons: [{
          label: '二维码名片',
          icon: "icon-weixin",
          className: "btn-share"
        },
        {
          label: '短信名片',
          icon: "icon-msnui-msg-invert",
          className: "btn-msg"
        },
        {
          label: '转发给好友',
          icon: "icon-zhuanfa",
          className: "btn-code"
        },
      ],
      buttonClicked(index, item) {
        index === 2 && self.setData({
          isOpen: false
        })
        index === 1 && self.sendInfoHandle()
        index === 0 && wx.navigateTo({
          url: '/pages/start/qrcode/qrcode'
        })
        return true
      },
      callback(vm, opened) {
        vm.setData({
          opened,
        })
      },
    })
  },
  sendInfoHandle() {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    const curuinfo = that.data.userInfo; //名片人
    if (curuinfo.cardtype == 0) {
      wx.showToast({
        title: '尊敬的用户,您还未成为vip,请购买后使用~',
        icon: 'none'
      })
      that.setData({
        isOpen: false
      })
      return;
    }
    api.SmsShare({
      success: (res) => {
        wx.showToast({
          title: res.data.Data,
          icon: 'none'
        })
      }
    });
    that.setData({
      isOpen: false
    })
  },
  onShareAppMessage: function(options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    const curuinfo = that.data.userInfo; //名片人
    var title = "您好，我是" + curuinfo.name + "，这是我的名片，请惠存";
    var shareObj = {
      title: title, // 默认是小程序的名称(可以写slogan等)
      path: "/pages/main/index?curuid=" + curuinfo.id, // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: "", //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          that.ForwardCount();
        }
      },
      fail: function(res) {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      }
    };
    // 来自页面内的按钮的转发
    if (options.from == 'button') {

    }
    // 返回shareObj
    return shareObj;
  },
  ForwardCount: function() {
    var that = this;
    api.HandelForward({
      data: {
        id: that.data.userInfo.id
      },
      method: "post",
      success: (res) => {
        if (res.data.StatusCode == 200) {
          // console.log(1111)
          // //当前数据+1
          // that.setData({
          //     ['curuserInfo.forwardingnum']: that.data.curuserInfo.forwardingnum + 1,
          // });
        }
      }
    });
  },
})