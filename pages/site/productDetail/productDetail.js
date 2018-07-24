// pages/productDetail/productDetail.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
          fileDomain: app.static_data.file_domain_url,
          product:{},
          productId:0,
          article:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  var id = options.pid;
  wx.getStorage({
    key: 'list',
    success: function(res) {
     var list=res.data;
     for(var i=0;i<list.length;i++){
       if(id==list[i].id){
         var article = list[i].detail;
         that.setData({
           product:list[i],
           article: app.WxParse.wxParse('article', 'html', article, that, 0)
         })
       }
     }
    }
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