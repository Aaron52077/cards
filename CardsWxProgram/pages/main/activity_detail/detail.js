// pages/main/activity_detail/detail.js
const api = require('api.js');
const wxparse = require("../../../wxParse/wxParse.js");
const App = getApp();

Page({
    data: {
        id: '',
        options: null,
        Detail: {},
        windowWidth: App.globalData.systemInfo.windowWidth
    },
    onLoad: function (options) {
        const self = this;
        const id = options.id;
        const cmd = options.type;
        self.setData({
            id: id,
            
        });
        wx.showToast({
            title: '正在加载',
            icon: 'loading',
            duration: 1000,
        });
        api.getActivitybyId({
            data: {
                id: id,
                'type': cmd
            },
            success: (res) => {
                const detail = res.data.Data;
                const articleInfo = res.data.Data.info
                self.setData({
                    Detail: detail
                });
                wx.setNavigationBarTitle({
                    title: detail.name
                })
                wxparse.wxParse('article', 'html', articleInfo, self, 5);
                wx.hideToast();
            },
        });
    },
})