const MENU_WIDTH_SCALE = 0.85;
const FAST_SPEED_SECOND = 50;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;
//获取应用实例
const app = getApp();
import config from './config';
const api = require('api.js');

const util = require('../../utils/util.js');

Page({
    data: {
        config,
        windowHeight: app.globalData.systemInfo.windowHeight,
        showBottomPopup: false,
        guideFalg: false,
        scrollTop: 0,
        userIndexInfo: {},
        imgUrls: [],
        curuid: 0, //当前用户id
        curuserInfo: null,
        userInfo: null,
        TagList: [],
        markers: [],
        commentPopup: -1, // 评论回复开关
        ui: {
            windowWidth: 0,
            menuWidth: 0,
            offsetLeft: 0,
            tStart: true
        }
    },
    onLoad: function(options) {
        var that = this;
        var cur_uid = options.curuid;
        that.setData({
            cur_uid: cur_uid
        });
        try {
            let res = wx.getSystemInfoSync()
            this.windowWidth = res.windowWidth;
            this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
            this.data.ui.offsetLeft = 0;
            this.data.ui.windowWidth = res.windowWidth;
            this.setData({
                ui: that.data.ui
            })
        } catch (e) {}
    },

    // 添加到手机通讯录  
    formAddPhoneContactSubmit(e) {
        var uinfo = this.data.curuserInfo;
        wx.addPhoneContact({
            nickName: uinfo.nickName,
            firstName: uinfo.name, //联系人姓名  
            mobilePhoneNumber: uinfo.phone, //联系人手机号  
            organization: uinfo.companyname,
            title: uinfo.position,
            email: "",
            remark: "来自蜂巢名片",
            weChatNumber: uinfo.wechatNum,
            hostNumber: uinfo.companyTel,
            workAddressStreet: uinfo.companyAddress,
        })
    },
    //拨打电话
    callPhone(e) {
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
        })
    },
    //到访公司线路
    Visitingline(e) {
        wx.openLocation({
            latitude: parseFloat(e.currentTarget.dataset.latitude),
            longitude: parseFloat(e.currentTarget.dataset.longitude),
            scale: 16,
            name: e.currentTarget.dataset.name,
            address: e.currentTarget.dataset.address
        })
    },
    toggleMenuPopup() {
        this.setData({
            showBottomPopup: !this.data.showBottomPopup
        });
    },
    onReady: function() {
        // 设置引导提示缓存
        // wx.setStorageSync('guideFalg', 1)
        // this.setData({
        //     hidden: true
        // }); 
    },
    onShow: function (options) {
        // var value = wx.getStorageSync('guideFalg')
        // if (value) {
        //     this.setData({
        //         guideFalg: false
        //     });
        // }
        var that = this;
        var cur_uid = this.data.cur_uid;
        //请求当前id 用户信息
        api.getUserInfoById({
            data: {
                id: cur_uid
            },
            success: res => {
                if (res.data.StatusCode == 200) {
                    var curuserInfo = res.data.Data;
                    var logineduser = app.globalData.userInfo;
                    that.setData({
                        curuid: cur_uid,
                        curuserInfo: curuserInfo, //当前名片主体人
                        userInfo: logineduser //当前登录用户
                    });
                    //--设置标题
                    wx.showNavigationBarLoading();
                    wx.setNavigationBarTitle({
                        title: `${curuserInfo.name}的主页`
                    })
                    wx.hideNavigationBarLoading()
                    //---end

                    //1、加入名片夹
                    if (curuserInfo.id != logineduser.id) {
                        app.globalData.visitUserInfo = {
                            id: curuserInfo.id,
                            name: curuserInfo.name
                        };
                        api.CollectCard({
                            data: {
                                pid: curuserInfo.id,
                                inviterId: logineduser.id
                            },
                            method: "post",
                            success: (res) => {}
                        });
                    }
                }
            }
        });
        api.GetCardIndex({
            data: {
                uid: cur_uid
            },
            success: res => {
                if (res.data.StatusCode == 200) {
                    var markers = [];
                    var companyInfo = res.data.Data.CompanyInfo;
                    if (companyInfo != null && companyInfo != undefined) {
                        markers = [{
                            latitude: parseFloat(companyInfo.latitude),
                            longitude: parseFloat(companyInfo.longitude),
                            name: companyInfo.name,
                            iconPath: '/image/location.png'
                        }];
                    }
                    this.setData({
                        markers: markers,
                        userIndexInfo: res.data.Data
                    });
                }
            }
        });
        api.GetCommentTagsNum({
            data: {
                cid: cur_uid
            },
            success: res => {
                this.setData({
                    TagList: res.data.Data
                })
            }
        });

        setTimeout(res => {
            if (this.data.curuid != this.data.userInfo.id) { //添加足迹
                api.HandleFootPrint({
                    data: {
                        cid: this.data.curuid,
                        info: `用户【${this.data.userInfo.name}】浏览了你的主页`,
                        'type': 1,
                        url: 'pages/main/index?curuid=' + this.data.curuid
                    },
                    method: "post",
                    success: res => {
                        
                    }
                });
            }
        }, 2500);
    },
    onHide: function() {
        this.setData({
            commentPopup: -1
        });
    },
    // 引导弹窗
    guideHandle() {
        this.setData({
            guideFalg: false
        });
    },
    //评论弹出层
    commentHandle(e) {
        var commentPopup = this.data.commentPopup;
        var that = this;
        var index = e.currentTarget.dataset.index;
        if (index == commentPopup) {
            that.setData({
                commentPopup: -1
            });
        } else {
            that.setData({
                commentPopup: parseInt(index)
            });
        }
    },
    //评论点赞
    handleCommentLike(e) {
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
                    var path = "userIndexInfo.HotComments[" + index + "].SubCommentLike";
                    var likes = this.data.userIndexInfo.HotComments[index].SubCommentLike;
                    var data = {
                        id: app.globalData.userInfo.id,
                        uname: app.globalData.userInfo.name
                    };
                    this.setData({
                        [`${path}`]: likes.concat(data),
                        commentPopup: -1
                    });
                } else {
                    util.showTextModal(res.data.Data);
                    this.setData({
                        commentPopup: -1
                    });
                }
            }
        });
    },
    //图集详情
    showGallery(e) {
        const current = e.currentTarget.dataset.current
        wx.navigateTo({
            url: `/pages/main/atlas_gallery/list?id=${current}`
        })
    },
    //点赞
    handelLike() {
        var that = this;
        if (that.data.userInfo == null) {
            // 前往授权登录界面
            wx.navigateTo({
                url: '/pages/login/index'
            });
            return;
        }
        var like = wx.getStorageSync(`${this.data.curuserInfo.id}__${this.data.curuid}like`);
        if (like) {
            util.showTextModal('你已经点过赞了');
            return false;
        }
        api.HandelLike({
            data: {
                id: that.data.curuserInfo.id
            },
            method: "post",
            success: (res) => {
                if (res.data.StatusCode == 200) {
                    util.showSuccessModal("点赞成功");
                    //当前数据+1
                    that.setData({
                        ['curuserInfo.likenum']: that.data.curuserInfo.likenum + 1,
                    });
                    wx.setStorageSync(`${this.data.curuserInfo.id}__${this.data.curuid}like`, "like");
                }
            }
        });
    },
    //我的名片
    btnmycrad() {
        wx.navigateTo({
            url: '/pages/start/index'
        });
    },
    onShareAppMessage: function(options) {
        var that = this;
        const curuinfo = that.data.curuserInfo; //名片人
        var logineduinfo = that.data.userInfo; //当前登录人
        var title = "您好，我是" + curuinfo.name + "，这是我的名片，请惠存";
        // 设置菜单中的转发按钮触发转发事件时的转发内容
        var shareObj = {
            title: title, // 默认是小程序的名称(可以写slogan等)
            path: `/pages/main/index?curuid=${curuinfo.id}&loginedid=${logineduinfo.id}`, // 默认是当前页面，必须是以‘/’开头的完整路径
            imgUrl: curuinfo.cardphotoMax, //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            success: function(res) {
                // 转发成功之后的回调
                that.ForwardCount();
            }
        };
        // 返回shareObj
        return shareObj
    },
    ForwardCount: function() {
        var that = this;
        api.HandelForward({
            data: {
                id: that.data.curuserInfo.id
            },
            method: "post",
            success: (res) => {
                if (res.data.StatusCode == 200) {
                    //当前数据+1
                    that.setData({
                        ['curuserInfo.forwardingnum']: that.data.curuserInfo.forwardingnum + 1,
                    });
                }
            }
        });
    },
    onPageScroll: function(e) {
        let self = this;
        // 页面显示
        const height = app.globalData.systemInfo.windowHeight;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease-in',
        })
        self.animation = animation
        if (e.scrollTop >= height / 2) {
            animation.opacity(1).step()
            self.setData({
                animationData: animation.export()
            })
            setTimeout(() => {
                this.setData({
                    hidden: false
                })
            }, 200)
        } else {
            animation.opacity(0).step()
            self.setData({
                animationData: animation.export(),
                hidden: true
            })
        }
    },
    goCaseDetail(e) {
        const id = e.currentTarget.dataset.id,
            isownadd = e.currentTarget.dataset.isownadd;

        wx.navigateTo({
            url: `/pages/main/case_detail/detail?id=${id}&isown=${isownadd}`
        })
    },
    clone() {
        let self = this;
        wx.setClipboardData({
            data: self.data.curuserInfo.wechatNum,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功',
                            icon: 'success',
                            duration: 500
                        })
                    }
                })
            }
        })
    },
    handlerStart(e) {
        let {
            clientX,
            clientY
        } = e.touches[0];
        this.tapStartX = clientX;
        this.tapStartY = clientY;
        this.tapStartTime = e.timeStamp;
        this.startX = clientX;
        this.data.ui.tStart = true;
        this.setData({
            ui: this.data.ui
        })
    },
    handlerMove(e) {
        let {
            clientX
        } = e.touches[0];
        let {
            ui
        } = this.data;
        let offsetX = this.startX - clientX;
        this.startX = clientX;
        ui.offsetLeft -= offsetX;
        if (ui.offsetLeft <= 0) {
            ui.offsetLeft = 0;
        } else if (ui.offsetLeft >= ui.menuWidth) {
            ui.offsetLeft = ui.menuWidth;
        }
        this.setData({
            ui: ui
        })
    },
    handlerCancel(e) {
        // console.log(e);
    },
    handlerEnd(e) {
        this.data.ui.tStart = false;
        let {
            ui
        } = this.data;
        let {
            clientX,
            clientY
        } = e.changedTouches[0];
        let endTime = e.timeStamp;
        //快速滑动
        if (endTime - this.tapStartTime <= FAST_SPEED_SECOND) {
            //向左
            if (this.tapStartY - clientY > FAST_SPEED_DISTANCE) {
                ui.offsetLeft = ui.menuWidth;
            } else if (this.tapStartY - clientY < -FAST_SPEED_DISTANCE && Math.abs(this.tapStartX - clientX) < FAST_SPEED_EFF_Y) {
                ui.offsetLeft = 0;
            } else {
                if (ui.offsetLeft >= ui.menuWidth / 2) {
                    ui.offsetLeft = 0;
                } else {
                    ui.offsetLeft = ui.menuWidth;
                }
            }
        } else {
            if (ui.offsetLeft >= ui.menuWidth / 2) {
                ui.offsetLeft = 0;
            } else {
                ui.offsetLeft = ui.menuWidth;
            }
        }
        this.setData({
            ui: ui
        })
    },
    handlerPageTap(e) {
        let {
            ui
        } = this.data;
        if (ui.offsetLeft != 0) {
            ui.offsetLeft = 0;
            this.setData({
                ui: ui
            })
        }
    },
    handlerAvatarTap(e) {
        let {
            ui
        } = this.data;
        if (ui.offsetLeft == 0) {
            ui.offsetLeft = ui.menuWidth;
            this.setData({
                ui: ui
            })
        }
    }
})