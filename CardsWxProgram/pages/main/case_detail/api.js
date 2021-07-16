const api = require("../../../utils/api.js");

//案例详情
const getCaseDetail = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/Card/Cases/GetDetail`);
};

//施工日志
const getDailyList = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/Card/Sites/Daily`);
};
//足迹添加
const HandleFootPrint = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};

module.exports = {
  getCaseDetail,
  getDailyList,
  HandleFootPrint
};
