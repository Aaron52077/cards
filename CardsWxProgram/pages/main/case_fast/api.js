const api = require("../../../utils/api.js");

const getPagedList = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/cases/PagedListCompany`);
};
//绑定
const BindCaseCompany = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/cases/BindCaseCompany`);
};

module.exports = {
  getPagedList,
  BindCaseCompany
};
