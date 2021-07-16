// pages/login/layer/layer.js
Page({
  data: {
    isActive: 0,
    title: "会员登录"
  },
  tabToggle(e) {
    const id = e.currentTarget.dataset.menu;
    if (id != 0) {
      this.setData({
        isActive: parseInt(id),
        title: "会员注册"
      });
    } else {
      this.setData({
        isActive: parseInt(id),
        title: "会员登录"
      });
    }
  },
  formSubmit(event) {
    console.log("[wuli:field:submit]", event.detail.value);
  },
  goVersion() {
    wx.navigateTo({
      url: "/pages/main/company_search/list"
    });
  },
  forgetHanle() {
    wx.navigateTo({
      url: "/pages/main/user/user"
    });
  }
});
