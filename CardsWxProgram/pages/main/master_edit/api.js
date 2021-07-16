const api = require("../../../utils/api.js");

const HandleSelfCaseData = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/cases/HandleData`);
};
const getDetail = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/cases/GetDetail`);
};

module.exports = {
  HandleSelfCaseData,
  getDetail
};
