const apiURL = 'https://api.ejiadg.cn';
const configId = 22152;//装修公司id->蜂巢营销工具集
const uploadPath = 'https://api.ejiadg.cn/api/fc/upload/UploadPicture';

const uploadserverUrl = 'https://api.ejiadg.cn/upload/atlas';

const wxRequest = (params, url) => {
    // wx.showLoading({
    //     title: '拼命加载中',
    // })
    wx.request({
        url,
        method: params.method || 'GET',
        data: params.data || {},
        header: {
            'content-type': 'application/json'
        },
        success(res) {
            if (params.success) {
                params.success(res);
               // wx.hideLoading()
            }
        },
        fail(res) {
            if (params.fail) {
                params.fail(res);
               // wx.hideLoading()
            }
        }
    });
};

//用户登录成功之后 与用户相关的请求必须带token
const wxTokenRequest = (params, url) => {
    var token = wx.getStorageSync('fc_card_token');
    // wx.showLoading({
    //     title: '拼命加载中',
    // })
    wx.request({
        url,
        method: params.method || 'GET',
        data: params.data || {},
        header: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        success(res) {
            if (params.success) {
                if (res.data != undefined && res.data != "" && res.data.StatusCode != undefined) {
                    if (res.data.StatusCode == 403 || res.data.StatusCode == 405) {
                        //token 失效 前往授权登录界面
                        wx.navigateTo({
                            url: '/pages/login/relogin/index'
                        });
                    }
                }
                params.success(res);
                //wx.hideLoading()
            }
        },
        fail(res) {
            if (params.fail) {
                params.fail(res);
                //wx.hideLoading()
            }
        }
    });
};

const wxPromise = (params, url) => {
    wx.showNavigationBarLoading()
    return new Promise((resove, reject) => {
        wx.request({
            url,
            method: params.method || 'GET',
            data: params.data || {},
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (params.success) {
                    wx.hideNavigationBarLoading()
                    // params.success(res);
                    resove(res.data)
                }
            },
            fail(res) {
                if (params.fail) {
                    wx.hideNavigationBarLoading()
                    // params.fail(res);
                    console.log('reqest error', res)
                }
            }
        });
    });
};

const postonLogin = (params) => {
    wxRequest(params, `${apiURL}/api/fc/WxOpen/OnLogin`);
};

const postRegister = (params) => {
    wxRequest(params, `${apiURL}/api/fc/WxOpen/Register`);
};
//得到系统配置项目
const getConfig = (params) => {
    wxRequest(params, `${apiURL}/api/wap/index/Configure?id=${configId}`);
};
//获取装修公司配置
const getDecWxconfig = (params) => {
    wxRequest(params, `${apiURL}/api/wap/index/GetDecWxconfig?id=${configId}`);
};

module.exports = {
    apiURL,
    configId,
    wxRequest,
    wxTokenRequest,
    postonLogin,
    postRegister,
    uploadPath,
    getConfig,
    getDecWxconfig,
    uploadserverUrl
};
