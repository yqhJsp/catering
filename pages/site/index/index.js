// pages/mall/index/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    banners: [],
    columns: [],
    mainInfo: {},
    shortcutInfos: [],
    appid: '',
    show:'',
    detail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;



    // that.get_home();
      app.userInfoReadyCallback = res => {
              that.get_home();
      } 
  },
  /**
      * 加载首页数据
      */
  get_home: function () {
    console.log("get_home");
    var that = this;
    wx.getExtConfig({
      success: function (res) {
        var appid = res.extConfig.appid;
        console.log(appid);
        app.api_util.homeData({ appid: appid }, "加载中", function sussess(res) {
          if (res.errcode == 0) {
            var data = res.result;
            var detail = data.columns;
            var mainInfo = data.mainInfo;
            console.log(mainInfo);    
            wx.setNavigationBarTitle({
                    title: mainInfo.name
            })
 
            app.globalData.createUserId = mainInfo.createUserId;
            app.globalData.mainInfo = mainInfo;
            console.log(app.globalData.createUserId)
            wx.setStorage({
              key: 'mainInfo',
              data: mainInfo,
            })
            wx.setStorage({
              key: 'detail',
              data: detail,
            })
            that.setData({
              banners: data.banners,
              columns: data.columns,
              mainInfo: mainInfo,

            })
          }
        }, function fail(res) {

        });
      }
    })
  },
  /*立即咨询*/
  goCounsel: function () {
    var that = this;
    wx.navigateTo({
      url: '../consulting/consulting'
    })
  },
  /*联系我们*/
  goCall: function (e) {
    var that = this;
    var phone = e.currentTarget.dataset.type;
    wx.makePhoneCall({
      phoneNumber: phone
    }, function sussess(res) {

    }, function fail(res) {

    })
  },
  /*栏目素材*/
  goMaterialsDetail: function (e) {
    var that = this;
    var istrue = e.currentTarget.dataset.type;
    var mid = e.currentTarget.dataset.id;
    if (istrue == 1) {
      wx.navigateTo({
        url: '../detail/detail?mid=' + mid
      })
    } else {
      return false
    }

  },
  /*店内点餐*/
  gonlie:function(e){
    var that=this;
    var types=e.currentTarget.dataset.type;
   wx.navigateTo({
     url: '../online/online?types=' + types,
   })
   },
  /*扫描二维码*/
  gonlies: function () {
    var that = this;
    wx.scanCode({
      success: function (res) {
       show = "--result:" + res.result + "--scanType:" + res.scanType + "--charSet:" + res.charSet + "--path:" + res.path;
      },
      fail: function (res) {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
    })
  },
  /*预定包间*/
  proceed:function(){
   wx.navigateTo({
     url: '../compartment/compartment',
   })
  },
 
 /*优惠买单*/
  preferent:function(){
    wx.navigateTo({
      url: '../preferential/preferential',
    })
  },
  /*获取当前坐标地理位置*/
  getlocation: function () {
    var that = this;
    var latitude = that.data.mainInfo.latitude;
    var longitude = that.data.mainInfo.longitude;
    var address = that.data.mainInfo.address;
    var indexDesc = that.data.mainInfo.indexDesc;
    console.log(latitude + longitude);
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var speed = res.speed;
        var accuracy = res.accuracy;
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          scale:23,
          address: '' + address + '',
          name:indexDesc
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
          var that = this;

          that.get_home();
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
    this.get_home();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 2000)
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