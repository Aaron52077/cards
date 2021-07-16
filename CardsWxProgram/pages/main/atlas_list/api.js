const api = require("../../../utils/api.js");

const AlbumList = (params) => {
  api.wxRequest(params, `${api.apiURL}/api/card/Atlas/PagedList`);
};
const Albumdel = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Atlas/Remove`);
};
const TopAlbum = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/Atlas/SetTop`);
};
//足迹添加
const HandleFootPrint = (params) => {
  api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};

module.exports = {
  AlbumList,
  Albumdel,
  TopAlbum,
  HandleFootPrint
};
