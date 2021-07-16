const api = require("../../../utils/api.js");

const getPagedList = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/cases/PagedList`);
};
//删除
const Remove = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/cases/Remove`);
};
//足迹添加
const HandleFootPrint = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};

module.exports = {
  getPagedList,
  Remove,
  HandleFootPrint
};
