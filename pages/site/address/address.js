// pages/mall/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
          index: 0,
          id:0,
          multiIndex: [0, 0, 0],
          date: '2016-09-01',
          time: '12:01',
          region: ['广东省', '广州市', '海珠区'],
          customItem: '全部',
          address_s:[],
          isList:0,
          name:'',
          phone: '',
          detail_address: '',
          isDefault: 0,
          isEdit:0,
          openid:'',
          appid:''
  },
  consigneeInput:function(e){
          this.setData({
            name:e.detail.value
          })
  },
  phoneInput: function (e) {
          this.setData({
                  phone: e.detail.value
          })
  },
  editAddress:function(e){
        console.log(e);  
        var that = this;  
        var id = e.currentTarget.dataset.id;
        var address_s = that.data.address_s;
        for (var i = 0; i < address_s.length;i++){
                var ad = address_s[i];
                if (id == ad.id){
                        if (ad.isDefault==1){
                          
                          }
                        that.setData({
                                name: ad.name,
                                phone: ad.phone,
                                detail_address: ad.address,
                                region: [ad.province, ad.city, ad.county],
                                id:id,
                                isList: 1,
                                isEdit: 1
                        }) 
                    break;    
             }    
        }
  },
  deleteAddress:function(e){
          console.log(e);
          var that = this;
          wx.showModal({
                  title: '提示',
                  content: '要删除该地址吗？',
                  success: function (res) {
                          if (res.confirm) {
                                  var id = e.currentTarget.dataset.id;
                                  console.log(id);
                                  app.api_util.deleteAddress(id, '', function success(res) {
                                          console.log(res);
                                          if (res.errcode == 0) {
                                                  app.toast.success('删除成功', 1500);
                                                  that.getAddress();
                                          } else {
                                                  app.toast.error('删除失败', 1500);
                                          }
                                  }, function fail(res) {
                                          app.toast.error('删除失败', 1500);
                                  });
                          } else if (res.cancel) {
                                  console.log('用户点击取消')
                          }
                  }
          })
          
  },
  addressInput:function(e){
          this.setData({
            detail_address: e.detail.value
          })   
  },
  checkedChange:function(e){
         var selected = e.target.dataset.checks;
         if (selected==0){
                 this.setData({
                         isDefault: 1
                 }) 
         }else{
                 this.setData({
                         isDefault: 0
                 }) 
         }
 
  },
  /**
   * 保存数据按钮
   */
  saveAddress:function(){
          var that = this;
          var region = that.data.region;
          var name = that.data.name;
          var phone = that.data.phone;
          var province= region[0];
          var city=region[1];
          var county= region[2];
          var detail_address = that.data.detail_address;
          var isDefault= that.data.isDefault; 
          var address = that.data.detail_address;
          if (name == '') {
            app.toast.error('请填写姓名', 1500);
            return false
          }
          if (phone == '') {
            app.toast.error('请填写联系电话', 1500);
            return false
          }
          if (address == '') {
            app.toast.error('请选择填写详细', 1500);
            return false
          }
          wx.getStorage({
            key: 'mainInfo',
                  success: function (res) {
                    var mainInfo = res.data;
                    var mainInfoId=0;
                          var data = {
                                  "name": name,
                                  "phone": phone,
                                  "address": address,
                                  'openId': app.globalData.member.openId,
                                   'appid': that.data.appid,
                                   "mainInfoId": Number(mainInfo.id),
                                   "createUserId": app.globalData.createUserId
                          };
                          console.log(data);   
                          if(that.data.id == 0){
                            app.api_util.saveAddressList(data, "", function success(res) {
                                          if (res.errcode == 0) {
                                                  wx.showToast({
                                                          title: '新增地址成功',
                                                          icon: 'success',
                                                          duration: 2000
                                                  })
                                                  that.getAddress();
                                                  that.setData({
                                                          isList: 0
                                                  })
              
                                          }
                                  }, function fail(res) {

                                  }); 
                          }else{
                                  data.id = that.data.id;
                                  app.api_util.updateAddress(data, "", function success(res) {
                                          if (res.errcode == 0) {
                                                  app.toast.success('更新地址成功'
                                                          ,2000
                                                   )
                                                  that.getAddress();
                                                  that.setData({
                                                          isList: 0
                                                  })
                                          }
                                  }, function fail(res) {
                                          app.toast.error('更新地址失败',
                                                  2000
                                          )
                                  });    
                          } 
                    
                  }
          })    
  },
  setAddress:function(e){
      console.log(e);  
      var id = e.currentTarget.dataset.id;
      var list = this.data.address_s;  
      for (var i = 0; i < list.length;i++){
          var el =   list[i];
          if(el.id == id){
             wx.setStorage({
                     key: "getAddress",
                 data: el
               })     
             break;    
          }
      }
      wx.navigateBack({
              delta: 1
      })
  },
  /**
   * 添加按钮
   */
  addAddress:function(){
        var that = this; 
        that.setData({
                name:'',
                phone:'',
                address:'',
                region: ['广东省', '广州市', '海珠区'],
                id:0,
                isList: 1,
                isEdit: 0
        })
  },
  /*省市区选择器*/
  bindRegionChange: function (e) {
          console.log('picker发送选择改变，携带值为', e.detail.value)
          this.setData({
                  region: e.detail.value
          })
  },
  getAddress: function () {
          var that = this;
          var openId = app.globalData.member.openId;
              app.api_util.getAddressList({openId: openId}, "", function success(res) {   
             if(res.errcode == 0){
                     that.setData({
                         address_s: res.result
                     })
             }         
          }, function fail(res) {

          });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var that = this;
          this.getAddress();
          wx.getStorage({
            key: 'openid',
            success: function(res) {
              that.setData({
                openid:res.data
              })
            },
          });
          wx.getExtConfig({
            success: function (res) {
              var appid = res.extConfig.appid;
              that.setData({
                appid: appid
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