// pages/main/message_list/list.js
const app = getApp();
const api = require('api.js');
const util = require('../../../utils/util.js');

Page({
    data: {
        PagedListData: [],
        searchCondition: {
            PageIndex: 1,
            uid: 0,//用户id
            keyword: ""
        },
        loading: false,
        totalpage: 0,
        windowsHeight: app.globalData.systemInfo.screenHeight,//设备高度
    },
    onLoad: function (options) {
        var that = this;
        var data = that.data.searchCondition;
        api.getPagedList({
            data,
            success: res => {
                var PagedListData = res.data.Data
                PagedListData.forEach(ele => {
                    ele.addtime = new Date(ele.addtime).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                });
                that.setData({
                    PagedListData: PagedListData,
                    totalpage: res.data.TotalPage,
                    loading: res.data.TotalPage <= 1 ? false : true
                });
            }
        })

    },//滚动距底部50触发事件
    loadMore: function () {
        var that = this;
        if (that.data.searchCondition.PageIndex >= that.data.totalpage) {
            that.setData({
                loading: false
            });
            return
        }
        that.setData({
            'loading': true,
            ['searchCondition.PageIndex']: that.data.searchCondition.PageIndex + 1
        });
        var data = that.data.searchCondition;
        api.getPagedList({
            data,
            success: res => {
                var PagedListData = res.data.Data
                PagedListData.forEach(ele => {
                    ele.addtime = new Date(ele.addtime).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                });
                that.setData({
                    PagedListData: that.data.PagedListData.concat(PagedListData),
                    totalpage: res.data.TotalPage,
                });
            }
        });
    },
    //已读
    handleRead: function (e) {
        var id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index,
            isRead = e.currentTarget.dataset.isRead;
        if (isRead) {
            return false;
        }
        api.handleRead({
            data: {
                id: id
            },
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    this.setData({
                        [`PagedListData[${index}].isRead`]: true
                    });
                    wx.hideLoading();
                }
            }
        });
    },
    handleDel: function (e) {
        var id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index;
        var that = this;
        wx.showModal({
            content: "删除当前消息？？",
            confirmText: "确定",
            cancelText: "取消",
            success: (b) => {
                if (b.confirm) {
                    api.handleDel({
                        data: { id: id },
                        method: "post",
                        success: (res) => {
                            that.data.PagedListData.splice(index, 1),
                                that.setData({
                                    PagedListData: that.data.PagedListData
                                });
                            util.showSuccessModal("删除成功");
                        }
                    });
                }
            }
        })
    },
})
