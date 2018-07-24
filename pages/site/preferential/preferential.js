// pages/site/preferential/preferential.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    favourable:0,//参与优惠金额
    nofavourable:0,//不参与优惠金额
    realPrice:0,//实际付款金额,
    mainInfo:{},
    openId:'',
    count:0,
    zksum:0,
    sfsum:0,
  },
  getZkSum:function(){
        var that = this;
        var d = that.data;
        var s = ((d.favourable * (d.mainInfo.discounts / 100)) / 100).toFixed(2);
        that.setData({
                  zksum: s
          })
  },
  getSfSum:function(){
          var that = this;
          var d = that.data;
          var s = (((d.favourable * (d.mainInfo.discounts / 100)) + d.nofavourable) / 100).toFixed(2);
          that.setData({
                  sfsum: s
          })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'mainInfo',
      success: function (res) {
        console.log(res.data + "uuuuu")
        that.setData({
          mainInfo: res.data
        })
      },
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openId: res.data
        })
      },
    })
  },
  prefInput: function (e) {
    var that=this;
    var value =e.detail.value;

    if (value.indexOf(".")!=-1){
            if (value.length <=2){
                    return;
            }
            var s = value.split(".")[1];
            console.log(s);
            if (s.length > 2) {
                    app.toast.error('格式不正确', 1500);
                    return;
            } 

    }
    console.log("ss:" + value)
    if (value !=0) {
            that.setData({
                    favourable: value * 100
            })  
    }
    that.getSfSum();
    that.getZkSum();
  },
  noPrefInput: function (e) {
          var that = this;
    var value = e.detail.value;
    that.setData({
      nofavourable: value*100
    })
    that.getSfSum();
    that.getZkSum();
  },
  
  //保存
  savePreferent:function(){
  var that=this;
  var intPrice =that.data.favourable;
  var outPrice = that.data.nofavourable;
  var mainInfoId = Number(that.data.mainInfo.id);
  var discounts = Number(that.data.mainInfo.discounts);
  var realPrice = that.data.sfsum;
  var openId = that.data.openId;
  if (intPrice == '') {
    app.toast.error('请填写优惠金额', 1500);
    return false
  }
  wx.getExtConfig({
    success: function (res) {
      var appid = res.extConfig.appid;
      var data={
        "appid": appid,
        "mainInfoId": mainInfoId,
        "intPrice": intPrice,
        "outPrice": outPrice,
        "discounts": discounts,
        "realPrice": realPrice,
        "openId": openId,
        "createUserId": app.globalData.createUserId
      }
      app.api_util.discountSorder(data, '', function success(res) {
        if (res.errcode == 0) {
          app.toast.success('提交成功', 1500);
          setTimeout(function(){
                  wx.switchTab({
                          url: '/pages/site/users/users',
                  })
          },1500);
          

        }
      }, function fail(res) {
        app.toast.error('提交失败', 1500);
      })
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