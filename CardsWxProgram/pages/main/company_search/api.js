const api = require("../../../utils/api.js");

const GetCompanyList = (params) => {
  //添加属性
  api.wxRequest(params, `${api.apiURL}/api/user/home/GetCompanyList`);
};
//发送验证码
const SendCode = (params) => {
  //添加属性
  api.wxRequest(params, `${api.apiURL}/api/fc/sms/Send`);
};
//验证验证码
const VerifyCode = (params) => {
  //添加属性
  api.wxRequest(params, `${api.apiURL}/api/fc/sms/Verify`);
};
//验证绑定公司信息
const BindCompnayWithCard = (params) => {
  //添加属性
  api.wxRequest(params, `${api.apiURL}/api/fc/sms/BindCompnayWithCard`);
};

module.exports = {
  GetCompanyList,
  SendCode,
  VerifyCode,
  BindCompnayWithCard
};
