// pages/main/activity_edit/upload.js
import { Field, Switch } from '../../../components/index';

const api = require('api.js');

const fcglobal = require('../../../utils/api.js');
const util = require('../../../utils/util.js');

const app = getApp();
Page(Object.assign({}, Field, Switch, {
    data: {
        form: {
            name: {
                error: true,
                title: '',
                placeholder: '请输入活动标题',
                componentId: 'name'
            },
            info: {
                error: true,
                title: '',
                type: 'textarea',
                placeholder: '请在这输入关活动的描述...',
                componentId: 'info'
            }
        },

        show: false,
        isNeedTel: {
            checked: false
        },
        isNeedRealName: {
            checked: true,
        },
        isNeedAddress: {
            checked: false,
        },
        formdata: {
            id: 0,
            uid: 0,
            name: "",
            info: "",
            atlas: "",//图集
            starttime: "",
            endtime: "",
            isNeedTel: false,//是否需要手机号
            isNeedRealName: true,
            isNeedAddress: false,
        },
        splacehodel: "请输入活动开始时间",
        eplacehodel: "请输入活动结束时间",
        atlasList: [],//图集
    },
    onLoad: function (options) {
        if (options.id) {//编辑
            api.GetDetail({
                data: {
                    id: options.id,
                    'type': options.type
                },
                success: res => {
                    if (res.data.StatusCode == 200) {
                        this.setData({
                            formdata: res.data.Data,
                            atlasList: this.data.atlasList.concat(res.data.Data.atlas.split(',')),
                            splacehodel: "",
                            eplacehodel: "",
                            ['isNeedTel.checked']: res.data.Data.isNeedTel,
                            ['isNeedRealName.checked']: res.data.Data.isNeedRealName,
                            ['isNeedAddress.checked']: res.data.Data.isNeedAddress,
                        });

                    }
                }
            });
        }
        this.setData({
            ['formdata.uid']: app.globalData.userInfo.id
        });
    },
    bindDateChange(e) {//时间选择
        var cmd = e.currentTarget.dataset.cmd;
        if (cmd == "start") {
            this.setData({
                ['formdata.starttime']: e.detail.value,
                splacehodel: "",
            });

        }
        else {
            this.setData({
                ['formdata.endtime']: e.detail.value,
                eplacehodel: ""
            });
        }
    },
    //输入框绑定
    handleWuliFieldChange(e) {
        if (e.componentId != "") {
            this.setData({
                show: true
            })
        }
        var cmd = e.componentId;
        if (cmd == "name") {
            this.setData({
                ['formdata.name']: e.detail.value,
            });
        }
        else {
            this.setData({
                ['formdata.info']: e.detail.value,
            });
        }
        if (this.data.formdata.name != "" && this.data.formdata.info != "") {
            this.setData({
                show: true
            })
        }
        else {
            this.setData({
                show: false
            })
        }
    },
    //单选按钮 切换
    handleWuliSwitchChange(e) {
        var componentId = e.componentId;
        var checked = e.checked;
        this.setData({
            [`formdata.${componentId}`]: checked,
            [`${componentId}.checked`]: checked
        })
    },
    //添加图图片
    //添加图片
    choseImage() {
        var that = this;
        wx.chooseImage({
            count: 10, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                res.tempFilePaths.forEach(function (imgPath) {
                    wx.uploadFile({
                        url: fcglobal.uploadserverUrl, //服务器接收地址
                        filePath: imgPath,
                        name: 'files',
                        formData: {
                            'folder': "cases"
                        },
                        success: function (e) {
                            var data = JSON.parse(e.data)
                            that.setData({
                                atlasList: that.data.atlasList.concat(data.url)
                            });
                        }
                    })
                });
            }
        })
    },
    formSubmit(event) {
        if (this.data.formdata.name == "") {
            util.showTextModal("活动标题不能为空");
            return false;
        }
        if (this.data.formdata.info == "") {
            util.showTextModal("活动内容不能为空");
            return false;
        }
        if (this.data.atlasList.length == 0) {
            util.showTextModal("活动图片不能为空");
            return false;
        }
        if (this.data.formdata.starttime == "") {
            util.showTextModal("活动开始时间不能为空");
            return false;
        }
        if (this.data.formdata.endtime == "") {
            util.showTextModal("活动结束时间不能为空");
            return false;
        }
        this.setData({
            ['formdata.atlas']: this.data.atlasList.join(",")
        });
        api.HandelData({
            data: this.data.formdata,
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    if (this.data.formdata.id == 0) {
                        util.showSuccessModal("添加成功");
                    }
                    else {
                        util.showSuccessModal("修改成功");
                    }
                }
                else {
                    util.showErrorModal("操作失败");
                }
                setTimeout(() => {
                    // 回到上一页
                    wx.navigateBack();
                }, 2000);
            }
        });
    },
}))