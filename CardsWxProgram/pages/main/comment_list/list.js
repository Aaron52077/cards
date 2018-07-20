// pages/main/comment_list/list.js
const app = getApp();
const api = require('api.js');
const util = require("../../../utils/util.js");
Page({
    data: {
        showBottomPopup: false,
        currentIndex: null,
        currentId: null,
        windowsHeight: app.globalData.systemInfo.windowHeight,//设备高度
        searchCondition: {
            PageIndex: 1,
            uid: 0,//用户id
            keyword: ""
        },
        totalpage: 0,

        CommentList: [],
        commentPopup: -1, // 评论回复开关
        TagList: [],

        cur_uid: 0,//当前用户id
        uid: 0,
        userInfo: null,
        loading: false,
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
            uid: uinfo.id,
            userInfo: uinfo,
            ['searchCondition.uid']: cur_uid,
        });
       
    },
    initPage(){
        var that = this;
        var data = that.data.searchCondition;
        api.CommentList({
            data,
            success: res => {
                if (res.data.StatusCode == 200) {
                    that.setData({
                        CommentList: res.data.Data,
                        totalpage: res.data.TotalPage,
                        loading: res.data.TotalPage <= 1 ? false : true
                    });
                }
            }
        });
        api.GetCommentTagsNum({
            data: {
                cid: this.data.cur_uid
            },
            success: res => {
                TagList: res.data.Data
            }
        });
    },
    commentHandle(e) {
        var commentPopup = this.data.commentPopup;
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (index == commentPopup) {
            that.setData({
                commentPopup: -1
            });
        }
        else {
            that.setData({
                commentPopup: parseInt(index)
            });
        }
    },
    onShow:function(){
        this.initPage();
        //足迹
        setTimeout(res => {
            if (this.data.cur_uid != this.data.userInfo.id) { //添加足迹
                api.HandleFootPrint({
                    data: {
                        cid: this.data.cur_uid,
                        info: `用户【${this.data.userInfo.name}】浏览了你的评论列表`,
                        'type': 5,
                        url: 'pages/main/comment_list/list?curuid=' + this.data.cur_uid
                    },
                    method: "post",
                    success: res => {
                        console.log(res);
                    }
                });
            }
        }, 2500);
    },
    onHide: function() {
        this.setData({
            commentPopup: -1
        })
    },
    //滚动距底部50触发事件
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
        api.CommentList({
            data,
            success: res => {
                if (res.data.StatusCode == 200) {
                    that.setData({
                        CommentList: that.data.CommentList.concat(res.data.Data),
                        totalpage: res.data.TotalPage
                    });
                }
            }
        });
    },
    thumbHanle(e) {
        // 索引值
        const id = e.currentTarget.dataset.vid;
        const index = e.currentTarget.dataset.index;
        this.setData({
            showBottomPopup: !this.data.showBottomPopup,
            currentIndex: index,
            currentId: id
        });
    },
    //删除
    handelDel() {
        var that = this;
        wx.showModal({
            content: "你确定要删除该评论？？",
            confirmText: "确定",
            cancelText: "取消",
            success: (b) => {
                if (b.confirm) {
                    api.CommentDel({
                        data: { id: that.data.currentId },
                        method: "post",
                        success: (res) => {
                            if (res.data.StatusCode === 200) {
                                that.data.CommentList.splice(that.data.currentIndex, 1),
                                    that.setData({
                                        showBottomPopup: !that.data.showBottomPopup,
                                        CommentList: that.data.CommentList,
                                    });
                                util.showSuccessModal("删除成功");
                            }
                        }
                    });
                }
            }
        })
    },
    //评论点赞
    handleLike(e) {
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        api.CommentLike({
            data: {
                id: id,
                uid: this.data.uid
            },
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    var path = "CommentList[" + index + "].SubCommentLike";
                    var likes = this.data.CommentList[index].SubCommentLike;
                    var data = {
                        id: app.globalData.userInfo.id,
                        uname: app.globalData.userInfo.name
                    };
                    this.setData({
                        [`${path}`]: likes.concat(data),
                        commentPopup: -1
                    });
                }
                else {
                    util.showTextModal(res.data.Data);
                    this.setData({
                        commentPopup: -1
                    });
                }
            }
        });
    },
    toggleBottomPopup() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },
})