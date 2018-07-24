// pages/consulting/consulting.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   fileDomain: app.static_data.file_domain_url,
   name:'',
   phone:'',
   numberPerson:'',
   openid:'',
   date:'',
   time:'',
   roomId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
          var that=this;
          var roomId=options.id;
          that.setData({
            roomId: roomId
          })
        wx.getStorage({
                key: 'openid',
                success: function(res) {
                        that.setData({
                           openid: res.data  
                   })     
                },
        })
  },
  /*日期控件*/
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
   /*时间控件*/
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
 nameInput: function (e) {
          this.setData({
                  name: e.detail.value
          })
  },
  phoneInput: function (e) {
          this.setData({
                  phone: e.detail.value
          })
  },
  numberInput: function (e) {
          this.setData({
                  numberPerson: e.detail.value
          })
  },
  /*立即预约*/
  shortly:function(){
    var that=this;
    wx.getStorage({
            key: 'mainInfo',
            success: function(res) {
              var mainInfo=res.data;
             var name=that.data.name
             var phone = that.data.phone;
             var diners = that.data.numberPerson;
             var reserveTime=that.data.date;
             var stage = that.data.time;
             var openId = that.data.openid;
             if (name==''){
                     app.toast.error('请填写姓名', 1500); 
                     return false     
             }
             if (phone == '') {
                     app.toast.error('请填写联系电话', 1500);
                     return false
             }
             if (reserveTime == '') {
               app.toast.error('请选择日期', 1500);
               return false
             }
             if (stage == '') {
               app.toast.error('请选择时间', 1500);
               return false
             }
             if (diners == '') {
               app.toast.error('请填写人数', 1500);
               return false
             }
            
             var data={
                     appid: mainInfo.appid,
                     mainInfoId: Number(mainInfo.id),
                     name:name,
                     phone: phone,
                     diners: Number(diners),
                     reserveTime: reserveTime,
                     stage: stage,
                     openId: openId,
                     roomId: Number(that.data.roomId),
                     createUserId: app.globalData.createUserId
             }
             app.api_util.reserVeroom(data, '', function success(res){
                     if (res.errcode == 0) {
                     app.toast.success('提交成功', 1500);
                     wx.switchTab({
                       url: '../index/index',
                     })
                     }
             },function fail(res){
                     app.toast.error('提交失败', 1500);
             })
            },
    })      
  },
 /*一键拨号*/
  telPhone:function(){
    var that = this;
    wx.getStorage({
      key: 'mainInfo',
      success: function(res) {
        var phone = res.data.phone;
        wx.makePhoneCall({
          phoneNumber: phone
        }, function sussess(res) {

        }, function fail(res) {

        })

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