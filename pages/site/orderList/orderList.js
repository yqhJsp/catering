// pages/site/orderList/orderList.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  fileDomain: app.static_data.file_domain_url,  
  list:[],
  type:1,
  title:'',
  openId:'',
  mainInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var t=options.types;
    that.setData({
      type: t,
    });
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openId: res.data 
        })
      },
    })
    wx.getStorage({
      key: 'mainInfo',
      success: function(res) {
        var main=res.data;
        that.setData({
          mainInfo:main
        })
      },
    })
  },
  /*获取店内订单*/
  getOrderList:function(){
   var that=this;
     app.api_util.getShoporderlist({ openId: app.globalData.member.openId }, '加载中...', function success(res) {
       if (res.errcode == 0) {
         that.setData({
           list: res.result
         })
       }
     }, function fail(res) {
       app.toast.error('加载失败', 1500);
     })
  },

  //外卖订单
  getOutOrderlist: function () {
    var that = this;
    app.api_util.getOutorderlist({ openId: app.globalData.member.openId}, '加载中...', function success(res) {
      if (res.errcode == 0) {
        var data = res.result;
        that.setData({
          list: data
        })
      }
    }, function fail(res) {
      app.toast.error('加载失败', 1500);
    })
  },

  //订单详情
  goOrderDetail:function(e){
    var that=this;
    var id = e.currentTarget.dataset.id;
   var list=that.data.list;
   var types=that.data.type;
   console.log(id+"sddsd")
   var oneOrder={};
   for(var i=0;i<list.length;i++){
    if(id==list[i].id){
      oneOrder=list[i];
      console.log(JSON.stringify(list[i]) + "mmmm")
    }
   }
   wx.setStorage({
     key: 'orderDetail',
     data: oneOrder,
   })
   wx.navigateTo({
     url: '../orderDetail/orderDetail?id=' + id + '&type=' + types,
   })
  },
  /*去支付*/
  goPay: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var sum = e.currentTarget.dataset.sum;
    var oneOrder = {};
        wx.showLoading({
          title: '结算中',
        })
        app.api_util.wechat_pay('商品支付', id, sum, app.globalData.member.openId);
        var list = that.data.list;
        for (var i = 0; i < list.length; i++) {
          if (id == list[i].id) {
            oneOrder = list[i];
            console.log(JSON.stringify(list[i]) + "mmmm")
          }
        }
        wx.setStorage({
          key: 'orders',
          data: oneOrder
        })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    if (that.data.type == 2) {
      that.getOutOrderlist()
    }
    if (that.data.type == 1) {
    that.getOrderList();
    }
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