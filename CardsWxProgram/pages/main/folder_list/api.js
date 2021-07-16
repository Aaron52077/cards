const api = require("../../../utils/api.js");
//获取某个名片夹的名片列表
const CardFoldertList = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/CardFoldertList`);
};
// 批量删除 名片
const DelFolderCard = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/DelFolderCard`);
};
// 获取名片夹列表FolderList
const FolderList = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/FolderList`);
};
//MoveToFolder 移动分组
const MoveToFolder = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Folder/MoveToFolder`);
};

module.exports = {
  CardFoldertList,
  DelFolderCard,
  FolderList,
  MoveToFolder
};
