const api = require('../../../utils/api.js');

const RemoveCompnayWithCard = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/Card/Company/RemoveCompnayWithCard`);
};
const GetBindCompanyInfo = (params) => {
    api.wxTokenRequest(params, `${api.apiURL}/api/Card/Company/GetBindCompanyInfo`);
};

module.exports = {
    RemoveCompnayWithCard,
    GetBindCompanyInfo
};
