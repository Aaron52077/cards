// pages/main/user/user.js
const app = getApp();
Page({
    data: {
        userInfo: null,
    },
    onLoad: function (options) {
        var that = this;
        var uinfo = app.globalData.userInfo;
        that.setData({
            userInfo: uinfo
        });
    },
})