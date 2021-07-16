module.exports = {
  // Form 中使用输入框
  form: {
    name: {
      focus: false,
      title: "名字",
      placeholder: "请输入名字",
      componentId: "name"
    },
    job: {
      error: true,
      title: "职位",
      placeholder: "请输入职位",
      componentId: "job"
    },
    tel: {
      error: true,
      title: "电话",
      inputType: "tel",
      placeholder: "请输入手机号",
      componentId: "tel"
    },
    wechat: {
      title: "微信号",
      disabled: true,
      value: "deng25887047",
      componentId: "wechat"
    },
    company: {
      title: "公司",
      placeholder: "请输入公司名称",
      componentId: "蔚来装饰有限公司"
    }
  }
};
