// pages/start/version/version.js
const api = require('api.js');
const app = getApp()

Page({
    data: {
        userInfo: null,
        VersionProducts: [],
        selectdIndex: 0,
    },
    onLoad: function (options) {
        var that = this;
        var uinfo = app.globalData.userInfo;
        that.setData({
            userInfo: uinfo
        });
        api.GetVersionProducts({
            success: res => {
                if (res.data.StatusCode == 200) {
                    that.setData({
                        VersionProducts: res.data.Data
                    });
                } else if (res.data.StatusCode == 401) {
                    // 绑定手机号
                    wx.redirectTo({
                        url: '/pages/login/bindphone/index'
                    });
                }
            }
        });
    },
    //立即支付
    buynow() {
        var uinfo = this.data.userInfo;
        var pro = this.data.VersionProducts[this.data.selectdIndex];
        api.submitOrder({
            data: {
                source: 20001,
                productId: pro.productId,
                name: pro.name,
                companyId: pro.companyId,
                type: pro.type,
                remark: '购买蜂巢名片小程序',
                price: pro.price
            },
            method: 'POST',
            success: (res) => {
                if (res.data.StatusCode == 888) { 
                    wx.navigateTo({
                        url: '/pages/start/add/add'
                    });
                } else {
                    //唤起微信支付
                    var result = res.data.Data;
                    wx.requestPayment({
                        'timeStamp': result.timeStamp,
                        'nonceStr': result.nonceStr,
                        'package': result.package,
                        'signType': 'MD5',
                        'paySign': result.paySign,
                        'success': function (res) {
                            //微信支付成功，跳转 创建名片信息页面……
                            wx.navigateTo({
                                url: '/pages/start/add/add'
                            });
                        },
                        'fail': function (res) {
                            //付款失败 提示
                        }
                    })
                }
            }
        });
    },
    chooseHanle(e) {
        const index = parseInt(e.currentTarget.dataset.index)
        this.setData({
            selectdIndex: index
        })
    }
})