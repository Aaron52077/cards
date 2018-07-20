const api = require('../../utils/api.js');

const GetIndexUser = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/GetIndexUser`);
};

//转发计数
const HandelForward = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/home/Forward`);
};


//短信转发分享
const SmsShare = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/home/SmsShare`);
};

module.exports = {
    GetIndexUser,
    HandelForward,
    SmsShare
};
