function formatNumber(n) {
  const num = n.toString();
  return num[1] ? num : `0${num}`;
}

function formatWan(num) {
  return num >= 10000 ? (num / 10000).toFixed(1) + "万" : num;
}

function formatUrl(url) {
  return url.substr(0, 5).toLowerCase() == "http:" ? url : "http:" + url;
}

function formatTime(date, type) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  let time = "";
  switch (type) {
    case 1:
      time = `${[year, month, day].map(formatNumber).join(".")}`;
      break;
    case 2:
      time = `${[year, month, day].map(formatNumber).join(".")} ${[hour, minute].map(formatNumber).join(":")}`;
      break;
    default:
      time = `${[year, month, day].map(formatNumber).join(".")} ${[hour, minute, second].map(formatNumber).join(":")}`;
  }
  return time;
}

class NumberAnimate {
  constructor(opt) {
    let def = {
      from: 50, //开始时的数字
      speed: 2000, // 总时间
      refreshTime: 100, // 刷新一次的时间
      decimals: 2, // 小数点后的位数
      onUpdate: function () {}, // 更新时回调函数
      onComplete: function () {} // 完成时回调函数
    };
    this.tempValue = 0; //累加变量值
    this.opt = Object.assign(def, opt); //assign传入配置参数
    this.loopCount = 0; //循环次数计数
    this.loops = Math.ceil(this.opt.speed / this.opt.refreshTime); //数字累加次数
    this.increment = this.opt.from / this.loops; //每次累加的值
    this.interval = null; //计时器对象
    this.init();
  }
  init() {
    this.interval = setInterval(() => {
      this.updateTimer();
    }, this.opt.refreshTime);
  }
  updateTimer() {
    this.loopCount++;
    this.tempValue = this.formatFloat(this.tempValue, this.increment).toFixed(this.opt.decimals);
    if (this.loopCount >= this.loops) {
      clearInterval(this.interval);
      this.tempValue = this.opt.from;
      this.opt.onComplete();
    }
    this.opt.onUpdate();
  }
  //解决0.1+0.2不等于0.3的小数累加精度问题
  formatFloat(num1, num2) {
    let baseNum, baseNum1, baseNum2;
    try {
      baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
  }
}

//提示框错误
function showErrorModal(str) {
  wx.showToast({
    title: str,
    image: "/image/error1.png",
    duration: 2000
  });
  setTimeout((res) => {
    wx.hideToast();
  }, 2000);
}

//提示框成功
function showSuccessModal(str) {
  wx.showToast({
    title: str,
    icon: "success",
    duration: 2000
  });
  setTimeout((res) => {
    wx.hideToast();
  }, 2000);
}

//纯文本
function showTextModal(str) {
  wx.showToast({
    title: str,
    icon: "none",
    duration: 2000
  });
  setTimeout((res) => {
    wx.hideToast();
  }, 2000);
}

module.exports = {
  formatNumber,
  formatUrl,
  formatTime,
  NumberAnimate,
  showErrorModal,
  showSuccessModal,
  showTextModal
};
