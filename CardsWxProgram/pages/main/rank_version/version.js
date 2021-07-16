// pages/main/rank_version/version.js
Page({
  data: {
    configData: ["一键添加案例、在建工地", "增加官网入口", "自动获取企业信息", "更多功能正在赶来"]
  },
  goVersion() {
    wx.navigateTo({
      url: "/pages/main/case_fast/list"
    });
  },
  colseHanle() {
    // 回到上一页
    wx.navigateBack();
  }
});
