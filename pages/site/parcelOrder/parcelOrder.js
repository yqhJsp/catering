// pages/site/parcelOrder/parcelOrder.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddress:1,
    fileDomain: app.static_data.file_domain_url,
    sqCodeStuats: false,
    list: {},
    orderList: [],
    totalNum: 0,
    totalSum: 0,
    numbers:0,
    address: {},
    appid: '',
    desc:'',
    check:1,
    types:2,
    mainInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'orderList',
      success: function (res) {
        that.setData({
          list: res.data
        })
        console.log(that.data.list + "uuuuu")
      },
    })
    //主体信息
    wx.getStorage({
      key: 'mainInfo',
      success: function (res) {
        that.setData({
          mainInfo: res.data
        })
      }
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
  //获取备注信息
  bindKeyInput: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },
  //获取用餐人数
  deskNumber: function (e) {
    this.setData({
      numbers: e.detail.value
    })
  },
  //获取地址
  goAddress:function(){
   var that=this;
   wx.navigateTo({
     url: '../address/address',
   })
  },
  getAddress: function () {
    var that = this;
    wx.getStorage({
      key: 'getAddress',
      success: function (res) {
        console.log(res.data);
        if (res.data != '') {
          that.setData({
            address: res.data,
            isAddress: 0
          })
        }

      }
    })
  },
  goPayment: function (e) {
    var that = this;
    var carlist = that.data.list.cartList;
    var addressId = that.data.address.id;
    var mainInfo = that.data.mainInfo;
    var openId = app.globalData.member.openId;
    var way = that.data.check;
    var sum=0;
    if (way==1){
      sum = that.data.list.totalPay;
    }
    else{
      sum = that.data.list.totalPay + parseFloat(mainInfo.delivery);
    }
    if (that.data.isAddress ==1) {
      app.toast.error('请选择地址', 1500);
      return false
    }
        var reOrderCooks = [];
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
          "copies": that.data.list.totalNum,
          "sum": sum,
          "mainInfoId": Number(mainInfo.id),
          "reOrderCooks": reOrderCooks,
          'appid': that.data.appid,
          "dinner": Number(that.data.numbers),
          "desc":that.data.desc,
          "way": way,
          "addressId": that.data.address.id,
          "createUserId": app.globalData.createUserId
        };
        wx.showLoading({
          title: '结算中',
        })
        app.api_util.orderbyout(data, "", function success(res) {
          if (res.errcode == 0) {
            var outTradeNo = res.result.id;
            app.api_util.wechat_pay('商品支付', res.result.id, res.result.sum, openId, that.data.types);
            console.log(that.data.types+"parcel")
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
  },
  checkedChange: function (e) {
    var selected = e.target.dataset.id;
    if (selected ==1) {
      this.setData({
        check: 1
      })
    } else {
      this.setData({
        check: 2
      })
    }

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
    this.getAddress();
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