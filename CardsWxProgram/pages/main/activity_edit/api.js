const api = require("../../../utils/api.js");

const HandelData = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Activity/HandelData`);
};
const GetDetail = (params) => {
  //添加属性
  api.wxRequest(params, `${api.apiURL}/api/card/Activity/GetDetail`);
};

module.exports = {
  HandelData,
  GetDetail
};
