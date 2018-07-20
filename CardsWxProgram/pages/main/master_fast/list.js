// pages/main/case_fast/list.js
const app = getApp();
const api = require('api.js');
const util = require('../../../utils/util.js');
Page({
    data: {
        menuPopup: false,
        menuIndex: 1,
        searchCondition: {
            //分页属性
            PageIndex: 1,
            style: 0,
            area: 0,
            unit: 0,
            uid: 0,
        },
        filter_style: wx.getStorageSync('filter_style'),
        filter_unit: wx.getStorageSync('filter_unit'),
        filter_area: wx.getStorageSync('filter_area'),
        scrollHeight: app.globalData.systemInfo.screenHeight - 52, //滚动高度
        caseData:[],
        loading: false,
        toggleFalg: false, // 开关
        chooseData: [], // 选择项的id集合
    },
    onLoad: function (options) {
        var self = this;
        self.setData({
            ['searchCondition.uid']: app.globalData.userInfo.id,
        });
        self.initPage();
    },
    initPage: function () {
        api.getPagedList({
            data: this.data.searchCondition,
            success: res => {
                if (res.data.StatusCode == 200) {
                    this.setData({
                        caseData: res.data.Data,
                        totalPage: res.data.TotalPage
                    });
                    //将已选中的案例标记勾选
                    res.data.Data.forEach((item, index) => {
                        if (item.ischecked) {
                            this.data.chooseData.push(item.id);
                            this.data.toggleFalg = true;
                        }
                    });
                    this.setData({
                        chooseData: this.data.chooseData,
                        toggleFalg: this.data.toggleFalg
                    });
                }
            }
        });
    },
    onShow: function () {

    },
    toggleMenu(e) {
        const menuId = parseInt(e.currentTarget.dataset.menu)
        this.setData({
            menuPopup: true,
            menuIndex: menuId
        });
    },
    closePopup() {
        this.setData({
            menuPopup: !this.data.menuPopup
        });
    },
    //筛选
    handleFilter: function (e) {
        var self = this;
        var id = e.currentTarget.dataset.id;
        switch (e.currentTarget.dataset.cmd) {
            case "style":
                {
                    self.setData({
                        'menuPopup': false,
                        ['searchCondition.style']: id,
                        ['searchCondition.PageIndex']: 1
                    });
                }
                break;
            case "unit":
                {
                    self.setData({
                        'menuPopup': false,
                        ['searchCondition.unit']: id,
                        ['searchCondition.PageIndex']: 1
                    });
                }
                break;
            case "area":
                {
                    self.setData({
                        'menuPopup': false,
                        ['searchCondition.area']: id,
                        ['searchCondition.PageIndex']: 1
                    });
                }
                break;
            default:
                break;
        }
        // wx.showToast({
        //     title: '正在加载',
        //     icon: 'loading',
        //     duration: 5000,
        // });
        // var data = self.data.searchCondition;
        this.initPage();
    },
    togglePopup() {
        this.setData({
            toggleFalg: !this.data.toggleFalg
        });
    },
    //滚动距底部50触发事件
    loadMore: function () {
        var that = this;
        if (that.data.searchCondition.PageIndex >= that.data.totalPage) {
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
                that.setData({
                    caseData: that.data.caseData.concat(res.data.Data),
                    totalPage: res.data.TotalPage,
                });
            }
        });
    },
    checkboxHandle(e) {
        let index = e.currentTarget.dataset.index,
            id = e.currentTarget.dataset.id,
            falg = 'caseData[' + index + '].ischecked',
            value = e.detail.value;

        if (falg && value.length) {
            this.setData({
                [falg]: true,
                toggleFalg: true,
                chooseData: this.data.chooseData.concat(id),
            })
        } else {
            var pindex = this.data.chooseData.indexOf(id);
            if (pindex != -1) {
                const chooseData = this.data.chooseData.splice(pindex, 1);
            }
            this.setData({
                [falg]: false,
                chooseData: this.data.chooseData
            })
        }
    },
    submitHandle() {
        api.BindCaseCompany({
            data: {
                ids: this.data.chooseData,
            },
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    util.showSuccessModal("导入成功");
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '/pages/main/master_list/list'
                        })
                    }, 2000);

                }
            }
        });

    }
})