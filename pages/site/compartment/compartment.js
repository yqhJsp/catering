// pages/site/compartment/compartment.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  wx.getExtConfig({
    success: function(res) {
      var appid = res.extConfig.appid;
  app.api_util.getRoomlist({ appid: appid }, "加载中", function sussess(res) {
    if (res.errcode == 0) {
      that.setData({
        list: res.result,
      })
    }
  }, function fail(res) {

  });
  }
})
  },
  /*跳转预定填写信息界面*/
  goConsult:function(e){
   var that=this;
   var id = e.currentTarget.id;
   var lists = that.data.list;
   var main = {};
   for (var i = 0; i < lists.length; i++) {
     if (id == lists[i].id) {
       main = lists[i]
     }
   }
   wx.setStorage({
     key: 'main',
     data: main,
   })
   wx.navigateTo({
     url: '../consulting/consulting?id='+id,
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