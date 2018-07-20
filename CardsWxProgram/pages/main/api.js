const api = require('../../utils/api.js');

const GetCardIndex = (params) => {
    //添加属性
    params.data["SubjectId"] = api.configId;
    api.wxRequest(params, `${api.apiURL}/api/card/home/GetInfo`);
};

//根据id 获取用户信息
const getUserInfoById = (params) => {
    api.wxRequest(params, `${api.apiURL}/api/user/home/UserInfo`);
};

//分类统计
const GetCommentTagsNum = (params) => {
    api.wxRequest(params, `${api.apiURL}/api/card/Comment/GetTagsNum`);
};

const CollectCard = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/Collect`);
};

const HandelLike = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/home/Likes`);
};

//转发计数
const HandelForward = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/home/Forward`);
};
//点赞
const CommentLike = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Comment/Likes`);
};
//足迹添加
const HandleFootPrint = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};
module.exports = {
    GetCardIndex,
    getUserInfoById,
    GetCommentTagsNum,
    CollectCard,
    HandelLike,
    HandelForward,
    CommentLike,
    HandleFootPrint
};
