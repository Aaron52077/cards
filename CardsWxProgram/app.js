//app.js
const api = require('/utils/api.js');
const util = require('/utils/util.js');

App({
    onLaunch: function (options) {
        const self = this
        // 获取设备信息
        wx.getSystemInfo({
            success(res) {
                self.globalData.systemInfo = res
            },
        });
        //全局缓存
        var filter_style = wx.getStorageSync('filter_style') || null
        if (filter_style == null) {
            api.getConfig({
                success: (res) => {
                    wx.setStorageSync('filter_style', res.data.Data.filter_style)
                    wx.setStorageSync('filter_area', res.data.Data.filter_area)
                    wx.setStorageSync('filter_unit', res.data.Data.filter_unit)
                    wx.setStorageSync('filter_titles', res.data.Data.filter_titles)
                    wx.setStorageSync('filter_stages', res.data.Data.filter_stages)
                }
            });
        }
        var scenes = options.scene,
            // sid是参数,建议兼容ios和android的时候强转换为整形  
            sid = Number(options.query.sid)
        // 获取用户信息  
        self.fcLogin(function (userInfo) {
            // 判断场景是否是从公众号进入（这里的意思是如果用户从公众号的自定义菜单进入的话且参数sid为1的话触发什么方法）  
            // 获取场景值在onLaunch方法中也可以获取到，但是呢由于业务要求我们的这个方法需要用户进入就会触发  
            // 各位可以根据需求去决定在哪里获取合适一些,onLaunch是小程序未关闭的情况下只执行一次,所以各位一定要考虑清楚  
            if (scenes === 1035 && sid === 1) {
                // 这里是从什么场景下要执行的方法
            }
        })
    },
    fcLogin: function (cb) {
        let self = this
        if (self.globalData.userInfo) {
            typeof cb == "function" && cb(self.globalData.userInfo)
        } else {
            self.LoginPageTimeOut();
        }
    },
    // 授权登录之后
    authorLogin: function (e) {
        var jsonResult = wx.getStorageSync('fc_uloginkey');
        if (jsonResult == null) {
            return;
        }
        let self = this
        var uInfo = e.detail.userInfo
        api.postRegister({
            method: "POST",
            data: {
                openid: jsonResult.openid,
                unionid: jsonResult.unionid,
                session_key: jsonResult.session_key,
                nickName: uInfo.nickName,
                avatarUrl: uInfo.avatarUrl,
                subjectId: api.configId,
                city: uInfo.city,
                country: uInfo.country,
                province: uInfo.province,
                gender: uInfo.gender,
                source: 20001//蜂巢名片
            },
            success: (result) => {
                if (result.data.StatusCode == 200) {
                    self.globalData.userInfo = result.data.Data
                    wx.setStorageSync('fc_card_token', result.data.token)
                    // 回到原来的地方放
                    wx.navigateBack();
                }
            },
        });
    },
    LoginPageTimeOut: function (cb) {
        let self = this
        wx.login({
            success: function (resquest) {
                if (resquest.code) {
                    api.postonLogin({
                        method: "POST",
                        data: {
                            code: resquest.code,
                            subjectId: api.configId,
                            source: 20001
                        },
                        success: (res) => {
                            wx.setStorageSync('fc_wxopem_sessionId', res.data.SessionId)
                            if (res.data.StatusCode == 200) {
                                //之前已登录过 直接绑定数据库中用户信息
                                var uinfo = res.data.Data;
                                self.globalData.userInfo = uinfo
                                //wx.setStorageSync('fc_card_ulogin', uinfo)
                                wx.setStorageSync('fc_card_token', res.data.token)

                                //未绑定手机号跳转绑定手机
                                if (uinfo.phone == "") {
                                    self.toBindPhone();
                                }
                            } else {
                                //新用户 跳转 引导用户授权获取用户信息
                                wx.setStorageSync('fc_uloginkey', res.data.Data)
                                self.toAuthorize();
                            }
                        }
                    });
                }
            }
        });
    },
    toIndex: function () {
        // 前往首页界面
        wx.navigateTo({
            url: '/pages/start/index'
        });
    },
    toAuthorize: function () {
        // 前往授权登录界面
        wx.navigateTo({
            url: '/pages/login/index'
        });
    },
    toBindPhone: function () {
        // 绑定手机号
        wx.navigateTo({
            url: '/pages/login/bindphone/index'
        });
    },

    globalData: {
        systemInfo: null,
        userInfo: null,//当前登录的用户信息
        visitUserInfo: {//分享出去之后 别人点击进来-名片主体人
            id: 0,
            name: ""
        }
    }
})
