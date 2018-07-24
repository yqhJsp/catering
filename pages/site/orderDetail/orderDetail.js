// pages/site/orderDetail/orderDetail.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url, 
    oneOrder:{},
    type:0, //1、餐饮 2、外卖
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  var t=options.type;
  that.setData({
    type:t
  })
  wx.getStorage({
    key: 'orderDetail',
    success: function(res) {
      that.setData({
        oneOrder: res.data
      })
    },
  })
  },
 //返回首页
  goHome:function(){
  wx.switchTab({
    url: '../index/index',
  })
  },

  //支付
  goPay: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var sum = e.currentTarget.dataset.sum;
    wx.showLoading({
      title: '结算中',
    })
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openId=res.data;
        app.api_util.wechat_pay('商品支付', id, sum,openId);
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})