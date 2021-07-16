const api = require("../../../utils/api.js");

const CommentAdd = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Comment/Add`);
};

//获取评论标签
const GetCommentTags = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/Comment/GetTags`);
};

module.exports = {
  CommentAdd,
  GetCommentTags
};
