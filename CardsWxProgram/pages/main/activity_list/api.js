const api = require("../../../utils/api.js");
//活动列表
const GetActivityList = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/Activity/PagedList`);
};
//删除
const ActivityDel = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/Activity/GetDetail`);
};
//足迹添加
const HandleFootPrint = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};

module.exports = {
  GetActivityList,
  ActivityDel,
  HandleFootPrint
};
