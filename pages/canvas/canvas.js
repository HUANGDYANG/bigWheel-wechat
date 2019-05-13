var app = getApp();
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: ""
  },
  gotoList: function () {
    wx.redirectTo({
      url: "../list/list"
    });
  },
  getLottery: function () {
    var that = this;
    // 获取奖品配置
    var awardsConfig = app.awardsConfig,
      runNum = 10; //转圈数
    var awardsLength = awardsConfig.awards.length;

    // *!important对应奖品列表的哪个奖品
    var awardIndex = (Math.random() * awardsLength) >>> 0;
    console.log(awardIndex);

    // if (awardIndex < 2) awardsConfig.chance = false

    // 初始化 rotate
    /*  var animationInit = wx.createAnimation({
        duration: 10
      })
      this.animationInit = animationInit;
      animationInit.rotate(0).step()
      this.setData({
        animationData: animationInit.export(),
        btnDisabled: 'disabled'
      })*/
    // 旋转抽奖
    app.runDegs = app.runDegs || 0;
    // console.log('deg', app.runDegs)
    app.runDegs =
      app.runDegs +
      (360 - (app.runDegs % 360)) +
      (360 * runNum - awardIndex * (360 / awardsLength));
    // console.log('deg', app.runDegs)

    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: "ease"
    });
    that.animationRun = animationRun;
    animationRun.rotate(app.runDegs).step();
    that.setData({
      animationData: animationRun.export(),
      btnDisabled: "disabled"
    });

    // 记录奖品
    // var winAwards = wx.getStorageSync("winAwards") || {
    //   data: []
    // };
    // winAwards.data.push(awardsConfig.awards[awardIndex].name + "1个");
    // wx.setStorageSync("winAwards", winAwards);

    // 中奖提示
    setTimeout(function () {
      wx.showModal({
        title: "恭喜",
        content: "获得" + awardsConfig.awards[awardIndex].name,
        showCancel: false
      });
      if (awardsConfig.chance) {
        that.setData({
          btnDisabled: ""
        });
      }
    }, 4000);

    /*wx.request({
      url: '../../data/getLottery.json',
      data: {},
      header: {
          'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '抱歉',
          content: '网络异常，请重试',
          showCancel: false
        })
      }
    })*/
  },
  onReady: function (e) {
    var that = this;

    // 奖品列表数据，可以是图片
    app.awardsConfig = {
      chance: true, //是否可以抽奖
      awards: [{
          index: 0,
          name: "1元红包"
        },
        {
          index: 1,
          name: "2元话费"
        },
        {
          index: 2,
          name: "3元红包"
        },
        {
          index: 3,
          name: "4元红包"
        },
        {
          index: 4,
          name: "5元话费"
        }
      ]
    };

    // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))

    // 绘制转盘
    var awardsConfig = app.awardsConfig.awards,
      len = awardsConfig.length,
      rotateDeg = 360 / len / 2 + 90,
      html = [],
      turnNum = 1 / len; // 文字旋转 turn 值
    that.setData({
      btnDisabled: app.awardsConfig.chance ? "" : "disabled"
    });
    var ctx = wx.createContext();

    // var ctx = wx.createCanvasContext('lotteryCanvas', that)
    // debugger
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((((360 / len) * i - rotateDeg) * Math.PI) / 180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0, (2 * Math.PI) / len, false);
      // 颜色间隔
      if (i % 2 == 0) {
        ctx.setFillStyle("pink");
      } else {
        ctx.setFillStyle("yellow");
      }

      // 填充扇形
      ctx.fill();
      // ctx.draw()
      // 绘制边框
      ctx.setLineWidth(1);
      ctx.setStrokeStyle("red");
      ctx.stroke();
      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({
        turn: i * turnNum + "turn",
        lineTurn: i * turnNum + turnNum / 2 + "turn",
        award: awardsConfig[i].name
      });
    }
    that.setData({
      awardsList: html
    });
    // 绘制
    wx.drawCanvas({
      canvasId: "lotteryCanvas",
      actions: ctx.getActions()
    });
  }
});