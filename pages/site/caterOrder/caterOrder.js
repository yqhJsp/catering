// pages/site/caterOrder/caterOrder.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    sqCodeStuats: false,
    list: {},
    orderList: [],
    totalNum: 0,
    totalSum: 0,
    mainInfo: {},
    appid:'',
    scene:'',
    number:0,
    orders:{},
    type:1,
    tableNumber: ''//桌号
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获得二维码的桌号扫码进入有此参数
    var scene = options.scene;
    // var scene = decodeURIComponent(options.scene);
    if (scene !=undefined) {
      that.setData({
        scene: scene
      })
    }
    console.log(scene + "mmmm")
    wx.getStorage({
      key: 'orderList',
      success: function (res) {
        that.setData({
          list: res.data
        })
      },
    })
    wx.getStorage({
      key: 'mainInfo',
      success: function (res) {
        console.log(res.data + "uuuuu")
        that.setData({
          mainInfo: res.data
        })
      },
    })
    //获取appid
    wx.getExtConfig({
      success: function (res) {
        var appid = res.extConfig.appid;
        that.setData({
          appid: appid
        })
      }
    })
  },
  /*不扫码*/
  deskNumber:function(e){
      this.setData({
        number: e.detail.value
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  goPayment: function (e) {
    var that = this;
    var carlist = that.data.list.cartList;
    var tableNumber='';
    var sum = 0;
    var discounts = e.currentTarget.dataset.discont;
    console.log(discounts+"ces")
    if (discounts!=''){
      sum = ((that.data.list.totalPay / 100) * (discounts/100))*100;
    }else{
      sum = that.data.list.totalPay
    }
    if (that.data.scene != '') {
      tableNumber = that.data.scene
    } else {
      tableNumber = that.data.number
    }
    if (tableNumber == '') {
      app.toast.error('请填写桌牌号', 1500);
      return false
    }
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var reOrderCooks = [];
        var openId = res.data;
        for (var i = 0; i < carlist.length; i++) {
          var pp = carlist[i];
          console.log(carlist[i]);
          reOrderCooks.push(
            {
              "cookId": carlist[i].cookId,
              "cookRuleId": carlist[i].cookRuleId,
              "realPrice": carlist[i].realPrice,
              "copies": carlist[i].copies
            });
        }
        var data = {
          "openId": openId,
          "tableNumber": Number(tableNumber),
          "copies": that.data.list.totalNum,
          "sum": that.data.list.totalPay,
          "mainInfoId": that.data.mainInfo.id,
          "reOrderCooks": reOrderCooks,
          'appid':that.data.appid,
          "createUserId": app.globalData.createUserId
        };
        wx.showLoading({
          title: '结算中',
        })
        app.api_util.orderbyin(data, "", function success(res) {
          if (res.errcode == 0) {
            var outTradeNo = res.result.id;
            app.api_util.wechat_pay('商品支付', res.result.id, res.result.sum, openId, that.data.type);
            // if (that.data.mainInfo.payType==1){
            // var outTradeNo = res.result.id;
            // app.api_util.wechat_pay('商品支付', res.result.id, res.result.sum, openId, that.data.mainInfo.type);
            // }else{
            //   wx.navigateTo({
            //     url: '/pages/site/orderList/orderList?id=' + res.result.id + '&type=' + that.data.mainInfo.type
            //   })
            // }
            wx.setStorage({
              key: 'orders',
              data: res.result,
            })
          } else {
            app.toast.error('支付单保存失败', 1500);
          }
        }, function fail(res) {
          console.log('order_insert error')
          wx.hideLoading();
          app.toast.error('结算失败', 1500);
        });

      }
    })
  }
})