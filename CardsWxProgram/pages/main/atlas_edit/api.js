const api = require('../../../utils/api.js');

const HandleData = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Atlas/HandleData`);
};
const getDetail = (params) => {
    //添加属性
    api.wxRequest(params, `${api.apiURL}/api/card/Atlas/GetDetail`);
};


module.exports = {
    HandleData,
    getDetail
};
