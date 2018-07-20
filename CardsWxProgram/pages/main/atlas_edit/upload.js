// pages/main/case_edit/upload.js
import { Field, Switch } from '../../../components/index';

const fcglobal = require('../../../utils/api.js');
const util = require('../../../utils/util.js');

const api = require('api.js');
const app = getApp();
Page(Object.assign({}, Field, Switch, {
    data: {
        form: {
            title: {
                error: true,
                title: '',
                placeholder: '请输入画集标题',
                componentId: 'title'
            },
            info: {
                error: true,
                title: '',
                type: 'textarea',
                placeholder: '请在这输入关于画集的描述...',
                componentId: 'info'
            },
            sync: {
                checked: false,
            },
        },
        info: "",//描述
        title: '',
        Atlas: [],//图集
        tags: "",//标签
        rank: 0,//默认为0
        filter_style: wx.getStorageSync('filter_style'),
        uid: 0,
        show: false,
        index: 7,
        id: 0,
    },
    onLoad: function (options) {
        var that = this;
        var id = options.id;
        if (id) {  //编辑
            var data = {
                id: id
            }
            api.getDetail({
                data,
                success: (res) => {
                    var Atlas = res.data.Data.Atlas.split(',');
                    var ischeck = res.data.Data.rank == 0 ? false : true;
                    that.setData({
                        info: res.data.Data.info,
                        title: res.data.Data.title,
                        Atlas: Atlas,
                        tags: res.data.Data.tags,
                        rank: res.data.Data.rank,
                        id: res.data.Data.id,
                        ['sync.checked']: ischeck
                    });
                }
            });
        }

        //用户id
        this.setData({
            uid: app.globalData.userInfo.id
        });
    },
    //选择标签
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value,
            tags: this.data.filter_style[e.detail.value].name
        })
    },
    handleWuliFieldChange(e) {
        // const { componentId, detail } = e;
        if (e.componentId != "") {
            this.setData({
                show: true
            })
        }
    },
    handleWuliFieldFocus(e) {
        const { componentId, detail } = e;
    },
    handleWuliFieldBlur(e) {
        const { componentId, detail } = e;
    },
    handleWuliSwitchChange(e) {
        var componentId = e.componentId;
        var checked = e.checked;
        if (componentId == 'sync') {
            // 同步开关
            this.setData({
                [`${componentId}.checked`]: checked,
                rank: 1,
            });
        }
    },
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
                                Atlas: that.data.Atlas.concat(data.url)
                            });
                        }
                    })
                });
            }
        })
    },
    formSubmit(event) {
        var formdata = JSON.stringify(event.detail.value);
        var data = {
            tags: this.data.filter_style[this.data.index].name,
            Atlas: this.data.Atlas.join(','),
            info: JSON.parse(formdata).info,
            title: JSON.parse(formdata).title,
            rank: this.data.rank,
            uid: this.data.uid,
            id: this.data.id
        }
        //验证
        if (data.Atlas.length == 0) {
            util.showErrorModal("图集不能为空");
            return false;
        }
        if (data.title == "") {
            util.showErrorModal("标题不能为空");
            return false;
        }
        if (data.info == "") {
            util.showErrorModal("内容不能为空");
            return false;
        }
        api.HandleData({
            data,
            method: "post",
            success: (res) => {
                if (res.data.StatusCode == 200) {
                    util.showSuccessModal("添加成功！");
                    setTimeout(res => {
                        // 回到上一页
                        wx.navigateBack();
                    }, 2000);
                }
            }
        });
    },
    delHandle(e) {
        const index = e.currentTarget.dataset.index;
        let Atlas = this.data.Atlas;
        Atlas.splice(index, 1);
        this.setData({
            Atlas: Atlas
        })
    }
}));