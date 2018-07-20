import { Field } from '../../../components/index';
import config from './config';

const fcglobal = require('../../../utils/api.js');
const util = require('../../../utils/util.js');

const api = require('api.js');
const app = getApp();

Page(Object.assign({}, Field, {
    data: {
        config,
        formData: {
            name: '',
            style: 1,
            area: null,
            unit: 1,
            address: '',
            price: null,
            status: 1,
            info: '',
            longitude: 0,
            latitude: 0,
            altas: "",
            id: 0,
            uid: 0,
            isCompelte: false
        },
        isdisable: false,//提交按钮是否
        sync: {
            checked: false,
        },//是否案例完成。
        filter_unit: wx.getStorageSync('filter_unit'),
        filter_style: wx.getStorageSync('filter_style'),
        filter_stages: wx.getStorageSync('filter_stages'),
        filter_status: [
            { id: 1, name: '在建' },
            { id: 2, name: '完工' }
        ],
        styleIndex: 1,
        unitIndex: 1,
        statusIndex: 1,
        hasLocation: false,//地址判断
        arrayAltas: [],
        show: false,
        userInfo: null,
    },
    onLoad: function (options) {
        var that = this;
        var uinfo = app.globalData.userInfo;
        that.setData({
            ['formData.uid']: uinfo.id,
            userInfo: uinfo,
        });
        var id = options.id;
        if (id) {  //编辑
            var data = {
                id: id,
                isOwn: options.isown
            }
            api.getDetail({
                data,
                success: (res) => {
                    var Atlas = res.data.Data.altas.split(',');
                    console.log(res.data);
                    that.setData({
                        ['formData.name']: res.data.Data.name,
                        ['formData.info']: res.data.Data.info,
                        ['formData.area']: res.data.Data.area,
                        ['formData.style']: res.data.Data.style,
                        ['formData.unit']: res.data.Data.unit,
                        ['formData.address']: res.data.Data.address,
                        ['formData.status']: res.data.Data.status,
                        ['formData.longitude']: res.data.Data.longitude,
                        ['formData.latitude']: res.data.Data.latitude,
                        ['formData.price']: res.data.Data.price,
                        ['formData.altas']: res.data.Data.altas,
                        ['formData.id']: res.data.Data.id,
                        statusIndex: res.data.Data.status,
                        unitIndex: parseInt(res.data.Data.unit) - 1,
                        styleIndex: parseInt(res.data.Data.style) - 1,
                        arrayAltas: Atlas
                    });
                }
            });
        }
    },
    //选择位置
    chooseLocation: function () {
        var that = this
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    hasLocation: true,
                    ['formData.address']: res.address,
                    ['formData.longitude']: res.longitude,
                    ['formData.latitude']: res.latitude
                })
            },
            fail: function () {
                wx.getSetting({
                    success: function (res) {
                        var status = res.authSetting;
                        if (!status['scope.userLocation']) {
                            wx.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function (tip) {
                                    if (tip.confirm) {
                                        wx.openSetting({
                                            success: function (request) {
                                                request.authSetting = {
                                                    "scope.userLocation": true
                                                }
                                                //授权成功之后，再调用chooseLocation选择地方
                                                wx.chooseLocation({
                                                    success: function (res) {
                                                        that.setData({
                                                            hasLocation: true,
                                                            ['formData.address']: res.address,
                                                            ['formData.longitude']: res.longitude,
                                                            ['formData.latitude']: res.latitude
                                                        })
                                                    },
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },
    //下拉选择
    bindSelectChange(e) {
        let cmd = e.currentTarget.dataset.type;
        switch (cmd) {
            case 'style': {
                this.setData({
                    styleIndex: e.detail.value,
                    ['formData.style']: this.data.filter_style[e.detail.value].id
                })
            } break;
            case 'unit': {
                this.setData({
                    unitIndex: e.detail.value,
                    ['formData.unit']: this.data.filter_unit[e.detail.value].id
                })
            } break;
            case 'stage': {
                this.setData({
                    statusIndex: e.detail.value,
                    ['formData.status']: this.data.filter_stages[e.detail.value].id
                })
            } break;
        }
    },
    handleWuliFieldChange(e) {
        if (e.componentId != "") {
            this.setData({
                show: true
            })
        }
        switch (e.componentId) {
            case 'name': {
                this.setData({
                    ['formData.name']: e.detail.value
                });
            } break;
            case 'area': {
                this.setData({
                    ['formData.area']: e.detail.value
                });
            } break;
            case 'price': {
                this.setData({
                    ['formData.price']: e.detail.value
                });
            } break;
            case "info": {
                this.setData({
                    ['formData.info']: e.detail.value
                });
            } break;
            default: {
            } break;
        }
    },
    //添加图片
    choseImage() {
        var that = this;
        wx.chooseImage({
            count: 10, // 默认9, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                wx.showLoading({
                    title: '正在上传图片...',
                })
                res.tempFilePaths.forEach(function (imgPath) {
                    //上传
                    wx.uploadFile({
                        url: fcglobal.uploadserverUrl, //图片接口
                        filePath: imgPath,
                        name: 'files',
                        formData: {
                            'folder': 'cases'
                        },
                        success: function (e) {
                            var data = JSON.parse(e.data)
                            if (data.success) {
                                that.setData({
                                    arrayAltas: that.data.arrayAltas.concat(data.url)
                                });
                                wx.hideLoading();
                            }
                        }
                    })
                });
            }
        })
    },
    handleWuliFieldFocus(e) {
        const { componentId, detail } = e;
    },
    handleWuliFieldBlur(e) {
        const { componentId, detail } = e;
    },
    //提交
    formSubmit(event) {
        this.setData({
            ['formData.altas']: this.data.arrayAltas.join(','),
            isdisable: true
        });
        //验证
        var data = this.data.formData;
        if (data.name == "") {
            util.showErrorModal("名称不能为空");
            this.setData({
                isdisable: false
            });
            return false;
        }
        if (data.area == "") {
            util.showErrorModal("面积不能为空");
            this.setData({
                isdisable: false
            });
            return false;
        }
        if (data.address == "") {
            util.showErrorModal("地址不能为空");
            this.setData({
                isdisable: false
            });
            return false;
        }
        if (data.price == "") {
            util.showErrorModal("报价不能为空");
            this.setData({
                isdisable: false
            });
            return false;
        }
        if (data.info == "") {
            util.showErrorModal("描述不能为空");
            this.setData({
                isdisable: false
            });
            return false;
        }
        if (data.altas == "") {
            util.showErrorModal("图集不能为空");
            this.setData({
                isdisable: false
            });
            return false;
        }
        //统一提交数据
        api.HandleSelfCaseData({
            data,
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    util.showSuccessModal("操作成功");
                    setTimeout(res => {
                        // 回到上一页
                        wx.navigateBack();
                    }, 2000);
                }
                else {
                    util.showSuccessModal("操作失败，请重试");
                    this.setData({
                        isdisable: true
                    });
                }
            }
        });
    },
    //移除单张图片
    delHandle(e) {
        const index = e.currentTarget.dataset.index;
        let Atlas = this.data.arrayAltas;
        Atlas.splice(index, 1);
        this.setData({
            arrayAltas: Atlas
        })
    }
}))