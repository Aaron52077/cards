const api = require('../../../utils/api.js');

//发送验证码
const GetVersionProducts = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/Card/Buy/GetVersionProducts`);
};

//发送验证码
const SendCode = (params) => {
    api.wxRequest(params, `${api.apiURL}/api/fc/sms/Send`);
};

const submitOrder = (params) => {
    params.data["SubjectId"] = api.configId;
    api.wxTokenRequest(params, `${api.apiURL}/api/Card/Buy/submitOrder`);
};


module.exports = {
    submitOrder,
    GetVersionProducts
};