const api = require('../../../utils/api.js');

const getPagedList = (params) => {
    //添加属性
    params.data["SubjectId"] = api.configId;
    api.wxRequest(params, `${api.apiURL}/api/card/Sites/PagedList`);
};

const delCase = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Cases/Remove`);
};

//设为案例
const SetSelfCase = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/Sites/SetCase`);
};
//足迹添加
const HandleFootPrint = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/card/FootPrint/add`);
};
module.exports = {
    getPagedList,
    delCase,
    SetSelfCase,
    HandleFootPrint
};
