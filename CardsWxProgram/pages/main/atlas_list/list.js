// pages/main/case_list/list.js
const app = getApp();
const api = require('api.js');
const util = require('../../../utils/util.js');
Page({
    data: {
        showBottomPopup: false,
        currentIndex: null,
        windowsHeight: app.globalData.systemInfo.windowHeight,
        searchCondition: {
            PageIndex: 1,
            uid: 0,//用户id
            keyword: ""
        },
        loading: false,
        totalpage: 0,

        AlbumList: [],
        currentId: 0,//当前操作的id

        cur_uid: 0,//当前用户id
        loginuid: 0,
        userInfo: null,
    },
    onLoad: function (options) {
        var that = this;
        var uinfo = app.globalData.userInfo;
        if (uinfo == null) {
            uinfo = { id: 0 };//表示未登录用户
        }
        var cur_uid = uinfo.id;
        if (options.curuid) {
            cur_uid = options.curuid;
        }
        that.setData({
            cur_uid: cur_uid,
            userInfo: uinfo,
            loginuid: uinfo.id,
            ['searchCondition.uid']: cur_uid,
        });
    },
    onShow: function () {
        this.initPage();
        setTimeout(res => {
            if (this.data.cur_uid != this.data.userInfo.id) { //添加足迹
                api.HandleFootPrint({
                    data: {
                        cid: this.data.cur_uid,
                        info: `用户【${this.data.userInfo.name}】浏览了你的图集列表`,
                        'type': 2,
                        url: 'pages/main/atlas_list/list?curuid=' + this.data.cur_uid
                    },
                    method: "post",
                    success: res => {

                    }
                });
            }
        }, 2500);
    },
    initPage: function () {
        var that = this;
        that.setData({
            ['searchCondition.PageIndex']: 1
        });
        var data = that.data.searchCondition;
        api.AlbumList({
            data,
            success: (res) => {
                if (res.data.StatusCode == 200) {
                    that.setData({
                        AlbumList: res.data.Data,
                        totalpage: res.data.TotalPage,
                        loading: res.data.TotalPage <= 1 ? false : true
                    });
                }
            }
        });
    },
    //滚动距底部50触发事件
    loadMore: function () {
        var that = this;
        if (that.data.searchCondition.PageIndex >= that.data.totalpage) {
            self.setData({
                loading: false
            });
            return
        }
        that.setData({
            'loading': true,
            ['searchCondition.PageIndex']: that.data.searchCondition.PageIndex + 1
        });
        var data = that.data.searchCondition;
        api.AlbumList({
            data,
            success: res => {
                that.setData({
                    AlbumList: that.data.AlbumList.concat(res.data.Data),
                    totalpage: res.data.TotalPage,
                });
            }
        });
    },
    //搜索
    bindconfirm(e) {
        var that = this;
        that.setData({
            'loading': true,
            ['searchCondition.keyword']: e.detail.value
        });
        that.initPage();
    },
    //跳转
    addThumbHanle() {
        wx.navigateTo({
            url: `/pages/main/atlas_edit/upload`
        })
    },
    goThumb(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/main/atlas_gallery/list?id=' + id,
        });
    },
    //弹出Popup
    thumbHanle(e) {
        // 索引值
        const index = e.currentTarget.dataset.vid
        this.setData({
            showBottomPopup: !this.data.showBottomPopup,
            currentIndex: index,
            currentId: e.currentTarget.dataset.id
        });
    },
    //删除
    handleDel() {
        var that = this;
        wx.showModal({
            content: "你确定要删除该图集？？",
            confirmText: "确定",
            cancelText: "取消",
            success: (b) => {
                if (b.confirm) {
                    api.Albumdel({
                        data: { id: that.data.currentId },
                        method: "post",
                        success: (res) => {
                            that.data.AlbumList.splice(that.data.currentIndex, 1),
                                that.setData({
                                    showBottomPopup: !that.data.showBottomPopup,
                                    AlbumList: that.data.AlbumList
                                });
                            util.showSuccessModal("删除成功");
                        }
                    });
                }
            }
        })
    },
    //编辑
    handleEdit() {
        wx.navigateTo({
            url: '/pages/main/atlas_edit/upload?id=' + this.data.currentId,
        });
    },
    //置顶
    handleTop: function () {
        var that = this;
        api.TopAlbum({
            data: { id: that.data.currentId },
            method: "post",
            success: (res) => {
                util.showTextModal("置顶成功！");
                let newAlbumList = that.data.AlbumList[that.data.currentIndex];
                that.data.AlbumList.splice(that.data.currentIndex, 1),
                    that.data.AlbumList.unshift(newAlbumList);

                that.setData({
                    AlbumList: that.data.AlbumList,
                    showBottomPopup: !that.data.showBottomPopup,
                });

            }
        });
    },
    toggleBottomPopup() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },
})