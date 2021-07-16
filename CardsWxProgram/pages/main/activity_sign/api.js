const api = require("../../../utils/api.js");

const submitSignup = (params) => {
  //添加属性
  params.data["SubjectId"] = api.configId;
  api.wxRequest(params, `${api.apiURL}/api/wap/budget/add`);
};

module.exports = {
  submitSignup
};
