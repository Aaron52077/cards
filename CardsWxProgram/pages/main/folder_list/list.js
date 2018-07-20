// pages/main/folder_list/list.js
const api = require('api.js');
const app = getApp();
Page({
    data: {
        chooseFlag: false,      // 选择开关
        uid: 0,
        cardList: [],
        ids: [],//操作的id集合
        indexList: [],//操作的数组索引

        moveFlag: false,        // 移至开关
        folderList: [],//
        folderid: 0,
    },
    onLoad: function (options) {
        var that = this;
        var id = options.id;
        that.setData({
            uid: app.globalData.userInfo.id,
            folderid: id
        });
        api.CardFoldertList({
            data: {
                id: id,
                keyword: ""
            },
            success: res => {
                if (res.data.StatusCode == 200) {
                    that.setData({
                        cardList: res.data.Data
                    });
                }
            }
        });
        api.FolderList({
            data: {
                id: this.data.uid,
                groupid: options.id
            },
            success: res => {
                var data = res.data.Data;
                //将数组新增字段
                data.map(v => (v["checked"] = false, v));
                this.setData({
                    folderList: data
                });
            }
        });
    },
    //关键字搜索
    bindconfirm(e) {
        wx.showToast({
            title: '加载中',
            icon: 'loading'
        })
        api.CardFoldertList({
            data: {
                id: this.data.folderid,
                keyword: e.detail.value
            },
            success: res => {
                if (res.data.StatusCode == 200) {
                    that.setData({
                        cardList: res.data.Data
                    });
                    wx.hideToast()
                }
            }
        });
    },
    chooseHanle() {
        this.setData({
            chooseFlag: !this.data.chooseFlag
        })
    },
    //错误提示
    showErrorModal(str) {
        wx.showToast({
            title: str,
            image: "/image/error1.png",
            duration: 2000
        })
        setTimeout(res => {
            wx.hideToast();
        }, 2000);
    },
    showSuccessModal(str) {
        wx.showToast({
            title: str,
            icon: "success",
            duration: 2000
        })
        setTimeout(res => {
            wx.hideToast();
            
        }, 2000);
    },
    // 勾选的值
    onCheckboxChange(e) {
        let index = e.currentTarget.dataset.index,
            id = e.currentTarget.dataset.id,
            falg = 'cardList[' + index + '].checked',
            value = e.detail.value;
        if (value.length) {
            this.setData({
                [falg]: true,
                ids: this.data.ids.concat(id),
                indexList: this.data.indexList.concat(index)
            })
        } else {
            //找到当前输入
            var mindex = this.data.ids.indexOf(id);
            var cindex = this.data.indexList.indexOf(index);
            this.data.ids.splice(mindex, 1);
            this.data.indexList.splice(cindex, 1);
            this.setData({
                [falg]: false
            })

        }
    },
    //批量删除
    handleDelCard() {
        var that = this;
        if (this.data.ids.length == 0) {
            this.showErrorModal("请先选择操作项！");
            return false;
        }
        console.log(this.data.indexList);
        var data = this.data.cardList.filter(res => {
            return res.checked = !res.checked
        });
        var ids = [];
        data.forEach(res => {
            ids.concat(res.id);
        });
        api.DelFolderCard({
            data: {
                ids: this.data.ids
            },
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    this.showSuccessModal("删除成功");
                    //批量删除先排序，从大到小
                    setTimeout(() => {
                        var data = this.data.cardList;
                        var indexList = this.data.indexList.sort((x, y) => {
                            return y - x;
                        })
                        indexList.forEach((value) => {
                            data.splice(value, 1)
                        });
                        that.setData({
                            cardList: data,
                            indexList: [],
                            ids: [],
                            chooseFlag: false
                        })
                    }, 2000);
                }
            }
        });
    },
    toggleRightPopup() {
        if (this.data.ids.length == 0) {
            this.showErrorModal("请先选择操作项！");
            return false;
        }
        this.setData({
            moveFlag: !this.data.moveFlag
        })
    },
    //移动分组
    radioChange: function (e) {
        var id = e.currentTarget.dataset.id;//移动到目标组的id
        var name = e.currentTarget.dataset.name;
        console.log(e);
        var data = {
            uid: this.data.uid,
            cids: this.data.ids,
            folderId: id,
            folderName: name
        };

        api.MoveToFolder({
            data: data,
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    this.showSuccessModal("移动成功");
                    //批量删除先排序，从大到小
                    setTimeout(() => {
                        var data = this.data.cardList;
                        var indexList = this.data.indexList.sort((x, y) => {
                            return y - x;
                        })
                        indexList.forEach((value) => {
                            data.splice(value, 1)
                        });
                        this.setData({
                            cardList: data,
                            indexList: [],
                            ids: [],
                            chooseFlag: false,
                            moveFlag: false,
                        })
                    }, 2000);
                }
                else {
                    this.showErrorModal("移动失败")
                    setTimeout(() => {
                        this.setData({
                            indexList: [],
                            ids: [],
                            chooseFlag: false,
                            moveFlag: false,
                        })
                    }, 1500);
                }
            }
        });

    },
    onShareAppMessage: function (options) {
        var that = this;
        // 设置菜单中的转发按钮触发转发事件时的转发内容
        var shareObj = {
            title: "",        // 默认是小程序的名称(可以写slogan等)
            path: "pages/main/folder_list/list",        // 默认是当前页面，必须是以‘/’开头的完整路径
            imgUrl: "",     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            success: function (res) {
                // 转发成功之后的回调
                if (res.errMsg == 'shareAppMessage:ok') {

                }
            },
            fail: function (res) {
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
})