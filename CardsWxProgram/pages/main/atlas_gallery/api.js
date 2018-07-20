const api = require('../../../utils/api.js');

const getDetail = (params) => {
    //添加属性
    api.wxRequest(params, `${api.apiURL}/api/card/Atlas/GetDetail`);
};
//足迹添加
const HandleFootPrint = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};
module.exports = {
    getDetail,
    HandleFootPrint
};