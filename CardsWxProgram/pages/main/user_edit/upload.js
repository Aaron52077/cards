// pages/main/user_edit/upload.js
import { Field } from "../../../components/index";
import config from "./config";

var sourceType = [["camera"], ["album"], ["camera", "album"]];
var sizeType = [["compressed"], ["original"], ["compressed", "original"]];

Page(
  Object.assign({}, Field, {
    data: {
      config,
      name: "李莎莎",
      job: "首席设计师",
      tel: "17608228219",
      company: "蔚来装饰有限公司",
      desc: "",
      imageList: [],
      sourceTypeIndex: 2,
      sourceType: ["拍照", "相册", "拍照或相册"],
      sizeTypeIndex: 2,
      sizeType: ["压缩", "原图", "压缩或原图"],
      countIndex: 0,
      count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    onLoad: function (options) {},
    handleWuliFieldChange(e) {
      const { componentId, detail } = e;
      // console.log('[wuli:field:change]', componentId, detail);
    },

    handleWuliFieldFocus(e) {
      const { componentId, detail } = e;
    },

    handleWuliFieldBlur(e) {
      const { componentId, detail } = e;
    },

    formSubmit(event) {
      // console.log('[wuli:field:submit]', event.detail.value);
      const userFormInfo = JSON.stringify(event.detail.value);
      wx.navigateTo({
        url: `/pages/start/index/index?info=${userFormInfo}`
      });
    },
    chooseImage: function () {
      var that = this;
      wx.chooseImage({
        sourceType: sourceType[that.data.sourceTypeIndex],
        sizeType: sizeType[that.data.sizeTypeIndex],
        count: that.data.count[that.data.countIndex],
        success: function (res) {
          that.setData({
            imageList: res.tempFilePaths
          });
        }
      });
    },
    previewImage: function (e) {
      var current = e.target.dataset.src;

      wx.previewImage({
        current: current,
        urls: this.data.imageList
      });
    }
  })
);
