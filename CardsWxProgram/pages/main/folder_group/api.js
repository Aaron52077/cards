const api = require('../../../utils/api.js');

//获取名片列表
const getPagedList = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/FolderWithUserList`);
};

//修改组名
const ModifyFolderName = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/ModifyFolderName`);
};
//删除分组
const DelFolder = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/DelFolder`);
};
//新增分组
const ModifyGrounp = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/ModifyGrounp`);
};
module.exports = {
    getPagedList,
    ModifyFolderName,
    DelFolder,
    ModifyGrounp
};
