// pages/site/call/call.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    info: {},
    indexDesc: '',
    mainInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'mainInfo',
      success: function (res) {
        that.setData({
          mainInfo:res.data
        })
      },
    })
    wx.getStorage({
      key: 'member',
      success: function (res) {
        that.setData({
          info: res.data
        })
      },
    })
  },

  /*跳转地址*/
  goAddress:function(){
   var that=this;
   wx.navigateTo({
     url: '../address/address',
   })
  },
  //优惠买单
  getPreferent: function () {
    wx.navigateTo({
      url: '../preferentList/preferentList',
    })
  },
  /*在线订单*/
  getOrder:function(e){
    var type=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../orderList/orderList?types=' + type,
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
    app.refresh();
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