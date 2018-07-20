const api = require('../../../utils/api.js');

const CommentList = (params) => {
    api.wxRequest(params, `${api.apiURL}/api/card/Comment/PagedList`);
};
const CommentDel = (params) => {
    //添加属性
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Comment/Remove`);
};
//点赞
const CommentLike = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Comment/Likes`);
};
//分类统计
const GetCommentTagsNum = (params) => {
    api.wxRequest(params, `${api.apiURL}/api/card/Comment/GetTagsNum`);
};
//足迹添加
const HandleFootPrint = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};
module.exports = {
    CommentList,
    CommentDel,
    CommentLike,
    GetCommentTagsNum,
    HandleFootPrint
};
