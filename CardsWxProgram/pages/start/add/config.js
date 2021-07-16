module.exports = {
  // Form 中使用输入框
  form: {
    name: {
      focus: false,
      title: "名字*",
      placeholder: "请输入名字",
      componentId: "name"
    },
    position: {
      error: true,
      title: "职位*",
      placeholder: "请输入职位",
      componentId: "position"
    },
    goodat: {
      error: true,
      title: "擅长",
      placeholder: "如：简约风；异性吊顶（用；分开）",
      componentId: "goodat"
    },
    phone: {
      error: true,
      title: "电话*",
      inputType: "tel",
      placeholder: "请输入手机号",
      componentId: "phone"
    },
    wechatNum: {
      title: "微信号*",
      error: true,
      placeholder: "请输入微信号",
      value: "deng25887047",
      componentId: "wechatNum"
    },
    companyTel: {
      title: "电话",
      placeholder: "请输入公司联系电话",
      componentId: "companyTel"
    }
  }
};
