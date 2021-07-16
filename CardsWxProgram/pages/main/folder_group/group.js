// pages/main/folder/folder.js
const api = require("api.js");
const app = getApp();

Page({
  data: {
    editFalg: true, // 编辑开关
    uid: 0, //
    cardList: [],
    addflag: true, //新增开关
    addform: [
      {
        CardCount: 0,
        CardList: [],
        groupId: -1,
        groupname: "新分组"
      }
    ],
    addname: "新分组"
  },
  onLoad: function (options) {
    var that = this;
    var uinfo = app.globalData.userInfo;
    api.getPagedList({
      data: {},
      success: (res) => {
        if (res.data.StatusCode == 200) {
          console.log(res.data.Data);
          that.setData({
            cardList: res.data.Data,
            uid: uinfo.id
          });
        }
      }
    });
  },
  bindconfirm(event) {
    console.log(event.detail.value);
  },
  editHanle() {
    this.setData({
      editFalg: !this.data.editFalg
    });
  },
  //刷新列表
  init() {
    var that = this;
    var data = {
      id: that.data.uid
    };
    api.getPagedList({
      data,
      success: (res) => {
        if (res.data.StatusCode == 200) {
          this.setData({
            cardList: res.data.Data,
            editFalg: !this.data.editFalg
          });
        }
      }
    });
  },
  //编辑确定
  editEndHanle() {
    var that = this;
    if (!that.data.addflag) {
      //新增确定
      var data = {
        id: 0,
        uid: that.data.uid,
        name: that.data.addname
      };
      api.ModifyGrounp({
        data,
        method: "post",
        success: (res) => {
          that.init();
          that.setData({
            addname: "新分组"
          });
        }
      });
    } else {
      this.init();
    }
  },
  //更改组名
  handlechangeFolder(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;

    if (id <= 0) {
      this.setData({
        addname: e.detail.value
      });
      return false;
    }
    var data = {
      SubjectId: e.currentTarget.dataset.id,
      name: e.detail.value
    };
    api.ModifyFolderName({
      data,
      method: "post",
      success: (res) => {}
    });
  },
  // 新增分组
  editAddHanle() {
    if (!this.data.addflag) {
      this.showErrorModal("请先保存");
      return false;
    }
    var cardlist = this.data.cardList.concat(this.data.addform);
    this.setData({
      cardList: cardlist,
      addflag: false
    });
  },
  //错误提示
  showErrorModal(str) {
    wx.showToast({
      title: str,
      image: "/image/error1.png",
      duration: 2000
    });
    setTimeout((res) => {
      wx.hideToast();
    }, 2000);
  },
  showSuccessModal(str) {
    wx.showToast({
      title: str,
      icon: "success",
      duration: 2000
    });
    setTimeout((res) => {
      wx.hideToast();
    }, 2000);
  },
  //删除
  delHanle(e) {
    var that = this;
    wx.showModal({
      content: "你确定要删除该分组吗？？",
      confirmText: "确定",
      cancelText: "取消",
      success: () => {
        let index = e.currentTarget.dataset.itemid;
        let id = e.currentTarget.dataset.id;
        var datal = that.data.cardList;
        //移除列表中下标为index的项
        datal.splice(index, 1);
        //更新列表的状态
        var data = {
          SubjectId: e.currentTarget.dataset.id
        };
        console.log(data);
        api.DelFolder({
          data,
          method: "post",
          success: (res) => {
            if (res.data.StatusCode == 200) {
              that.showSuccessModal(res.data.Data);
              setTimeout(() => {
                that.setData({
                  cardList: datal,
                  editFalg: true
                });
              }, 2000);
            }
          }
        });
      }
    });
  },
  editTitleHanle(e) {
    let index = e.currentTarget.dataset.vid,
      falg = "cardList[" + index + "].disabled";
    this.setData({
      [falg]: false
    });
  },
  editTitleEndHanle(e) {
    if (e.detail.value) {
      let index = e.currentTarget.dataset.vid,
        falg = "cardList[" + index + "].disabled";
      this.setData({
        [falg]: true
      });
    }
  }
});
