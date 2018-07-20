// pages/login/relogin/index.js
const app = getApp();
Page({
    data: {

    },
    onLoad: function (options) {
        // 获取用户信息  
        wx.showToast({
            title: '正重新登录，请稍后……',
            icon: 'loading',
            duration: 5000,
        });
        app.LoginPageTimeOut();
        setTimeout(res => {
            //回到原来的地方放
            wx.navigateBack();
            wx.hideToast();
        }, 2200);
    },
})