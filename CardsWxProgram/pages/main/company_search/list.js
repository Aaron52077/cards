// pages/main/company_search/list.js
const app = getApp();
const api = require('api.js');
const util = require('../../../utils/util.js');
Page({

    data: {
        showPopup: false,
        companyList: [],
        selectcompayId: 0,
        codemsg: "发送验证码",
        currentTime: 61,
        disabled: false,//button是否禁用
        phone: "",
        uid: 0,
    },

    onLoad: function (options) {
        this.setData({
            uid: app.globalData.userInfo.id
        });
    },
    //查询公司
    bindconfirm(e) {
        if (e.detail.value) {
            api.GetCompanyList({
                data: {
                    keyword: e.detail.value
                },
                success: res => {
                    //   if(res.data.StatusCode==200){
                    var data = res.data.Data;
                    data.map(v => (v["checked"] = false, v));
                    this.setData({
                        companyList: data
                    });
                }
                // }
            });
        }
    },
    handlechage(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    // 勾选的值
    onCheckboxChange(e) {
        let index = e.currentTarget.dataset.index,
            id = e.currentTarget.dataset.id,
            falg = 'configData[' + index + '].checked',
            value = e.detail.value;
        console.log(id)
        if (value.length) {
            this.setData({
                [falg]: true,
                showPopup: true,
                selectcompayId: id
            })
        } else {
            this.setData({
                [falg]: false,
                showPopup: false,
                selectcompayId: 0
            })
        }
    },
    //获取验证码
    handleGetCode() {
        //验证手机号
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (!myreg.test(this.data.phone)) {
            util.showErrorModal('手机号不合法');
            return false;
        }
        var that = this;
        //发送验证码
        api.SendCode({
            data: {
                phone: that.data.phone
            },
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    util.showSuccessModal("发送成功");
                    that.setCodeTime();
                }
            }
        });
    },
    //提交数据
    handleSubmit(e) {
        //首先验证验证码
        let code = e.detail.value.code;
        api.VerifyCode({
            data: {
                phone: this.data.phone,
                code: code
            },
            method: "post",
            success: res => {
                if (res.data.StatusCode == 200) {
                    //提交表单。
                    api.BindCompnayWithCard({
                        data: {
                            phone: this.data.phone,
                            companyId: this.data.selectcompayId,
                            uid: this.data.uid
                        },
                        method: "post",
                        success: res => {
                            if (res.data.StatusCode == 200) {
                                util.showTextModal("绑定成功,初始密码为你的手机号？");
                                //重新设置
                                app.globalData.userInfo = res.data.Data;
                                wx.navigateTo({
                                    url: '/page/start/index',
                                })

                            } else {
                                util.showTextModal("绑定失败,请先联系公司,创建员工账号之后在进行绑定");
                            }
                        }
                    });
                }
                else {
                    util.showErrorModal("验证码错误！");
                    return false;
                }
            }
        });
    },
    //设置验证码倒计时
    setCodeTime() {
        var that = this;
        var currentTime = that.data.currentTime;
        let interval = setInterval(function () {
            currentTime--;
            that.setData({
                codemsg: currentTime + '秒',
                disabled: true
            })
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    codemsg: '重新发送',
                    currentTime: 61,
                    disabled: false
                })
            }
        }, 1000)
    },
    togglePopup() {
        this.setData({
            showPopup: !this.data.showPopup
        });
    },
    formSubmit(event) {
        console.log('[wuli:field:submit]', event.detail.value);
    },
})