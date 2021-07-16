const api = require("../../../utils/api.js");

//发送验证码
const SendCode = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/fc/sms/Send`);
};
//验证验证码
const VerifyCode = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/fc/sms/Verify`);
};

//绑定手机号
const BindingPhone = (params) => {
  params.data["SubjectId"] = api.configId;
  api.wxRequest(params, `${api.apiURL}/api/user/home/bindingphone`);
};

//微信获取手机号
const WxGetPhoneNumber = (params) => {
  //添加属性
  params.data["SubjectId"] = api.configId;
  api.wxRequest(params, `${api.apiURL}/api/user/home/wxgetphonenumber`);
};

module.exports = {
  SendCode,
  VerifyCode,
  BindingPhone,
  WxGetPhoneNumber
};
