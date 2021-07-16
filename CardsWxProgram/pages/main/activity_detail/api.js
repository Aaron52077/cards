const api = require("../../../utils/api.js");

const getActivitybyId = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/Card/Activity/GetDetail`);
};

module.exports = {
  getActivitybyId
};
