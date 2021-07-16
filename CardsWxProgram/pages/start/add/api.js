const api = require("../../../utils/api.js");

const createCard = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/home/CreateBusinessCard`);
};

const getLoginedUInfo = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/home/GetLoginedUInfo`);
};

module.exports = {
  createCard,
  getLoginedUInfo
};
