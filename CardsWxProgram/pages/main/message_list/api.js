const api = require("../../../utils/api.js");

const getPagedList = (params) => {
  //添加属性
  params.data["SubjectId"] = api.configId;
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Message/PagedList`);
};
const handleRead = (params) => {
  //添加属性
  params.data["SubjectId"] = api.configId;
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Message/Read`);
};
const handleDel = (params) => {
  //添加属性
  params.data["SubjectId"] = api.configId;
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Message/Delete`);
};

module.exports = {
  getPagedList,
  handleRead,
  handleDel
};
