// pages/main/comment_edit/upload.js
const app = getApp();
const api = require("api.js");
const fcglobal = require("../../../utils/api.js");
const util = require("../../../utils/util.js");

Page({
  data: {
    textAreaDesc: "",
    placeholderText: "至少5个字嘛!",
    min: 5,
    max: 125,
    tagIndex: null,
    formdata: {
      content: "",
      pid: 0, //用于回复
      uid: 0, //发布评论的人
      cid: 0, //评论的对象
      tags: ""
    },
    tagsList: [],
    placehoder: " 留下点评，帮助更多人",
    submitText: "提交评论"
  },
  onLoad: function (options) {
    var uinfo = app.globalData.userInfo;
    if (options.id) {
      //有id代表为回复
      this.setData({
        ["formdata.pid"]: options.id,
        placehoder: "回复：" + options.name,
        submitText: "立即回复"
      });
      if (!options.curuid) {
        this.setData({
          ["formdata.uid"]: uinfo.id,
          ["formdata.cid"]: uinfo.id
        });
      }
    }
    if (options.curuid) {
      //l
      this.setData({
        ["formdata.uid"]: uinfo.id,
        ["formdata.cid"]: options.curuid
      });
    }
    api.GetCommentTags({
      success: (res) => {
        let tagsList = res.data.Data;
        tagsList.map((item) => ((item["checked"] = false), item));
        this.setData({
          tagsList: tagsList
        });
      }
    });
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      textAreaDesc: e.detail.value
    });
  },
  formSubmit: function (event) {
    if (event.detail.value.content.length <= 5) {
      util.showTextModal("字数不能少于5！");
      return false;
    }
    this.setData({
      ["formdata.content"]: event.detail.value.content
    });
    api.CommentAdd({
      data: this.data.formdata,
      method: "post",
      success: (res) => {
        if (res.data.StatusCode == 200) {
          util.showSuccessModal("评论成功");
          setTimeout((res) => {
            if (this.data.formdata.cid != app.globalData.userInfo.id) {
              wx.navigateTo({
                url: "/pages/main/comment_list/list?curuid=" + this.data.formdata.cid
              });
            } else {
              // 回到上一页
              wx.navigateBack();
            }
          }, 2000);
        } else {
          this.showErrorModal("评论失败");
        }
      }
    });
  },
  //字数限制
  textareaHanle(e) {
    let value = e.detail.value;
    let len = parseInt(value.length);

    //最少字数限制
    if (len <= this.data.min)
      this.setData({
        placeholderText: "请您多多填写评论内容哦~"
      });
    else if (len > this.data.min)
      this.setData({
        placeholderText: ""
      });
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      totalNum: len //当前字数
    });
  },
  tagHanle(e) {
    const value = e.currentTarget.dataset.id;
    this.setData({
      ["formdata.tags"]: this.data.tagsList[value].name,
      tagIndex: value
    });
  }
});
