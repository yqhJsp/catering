// pages/mall/waitPay/fail.js
const app = getApp();
Page({

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                list: ["质量问题", "卖家发错货", "货物与描述不符", "不喜欢/效果不好", "多拍/拍错/不想要", '其他'],
                isHidden: 0,
                showModalStatus: false,//显示遮罩,
                order: {},
                address: {},
                resonId: '',
                addressId: 0,
                orderId: 0,
                types:0

        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                var id = options.id;
                var types = options.types;
                that.setData({
                  types: types
                })
               wx.getStorage({
                 key: 'orders',
                 success: function(res) {
                   that.setData({
                     order: res.data,
                     address: res.data.address
                   })
                 },
               })
          
        },
        /*取消订单*/
        cancelItem: function (e) {
                var that = this;
                var id = e.currentTarget.id;
                that.setData({
                        orderId: id,
                        showModalStatus: true
                })
        },
        /*隐藏弹窗*/
        hideModal: function () {
                var that = this;
                that.setData({
                        showModalStatus: false
                })
        },
        chooseRson: function (e) {
                var that = this;
                var rid = e.currentTarget.dataset.idx;
                console.log(rid)
                // if (that.data.resonId=='') {
                        that.setData({
                          resonId: rid+1
                        })
                // }
        },

        /*去支付*/
        goPay: function () {
                var that = this;
                wx.getStorage({
                  key: 'openid',
                        success: function (res) {
                          var openId = res.data;
                                var outTradeNo = '';
                                var totalPrices = 0;
                                var order = that.data.order;
                                wx.showLoading({
                                        title: '结算中',
                                })
                                app.api_util.wechat_pay('商品支付', order.id, order.sum, openId, that.data.types);
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