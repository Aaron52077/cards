const api = require("../../../utils/api.js");

const WriteLog = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Sites/WriteLog`);
};

module.exports = {
  WriteLog
};
