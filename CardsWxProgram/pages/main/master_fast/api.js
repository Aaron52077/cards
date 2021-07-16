const api = require("../../../utils/api.js");

const getPagedList = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/sites/PagedListCompany`);
};
//绑定
const BindCaseCompany = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/sites/BindCaseCompany`);
};

module.exports = {
  getPagedList,
  BindCaseCompany
};
