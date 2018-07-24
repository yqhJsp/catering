const static_data = require('/static_data.js');
const app = getApp();
const request_util = require('/request_util.js');
const toast = require('/toast_util.js');
module.exports = {
  //微信业务下单接口
  //body 业务头部描述
  /**
   * outTradeNo 订单编号
   * totalFee：总金额
   * 
   */
  wechat_pay: function (body, outTradeNo, totalFee, openid,types) {
    var that = this;
    wx.getExtConfig({
      success: function (res) {
        var appid = res.extConfig.appid;
    that.unifiedorder({
      body: body,
      outTradeNo: outTradeNo,
      totalFee: totalFee,
      openid: openid,
      appid: appid
    }, "正在处理中", function success(res) {
      console.log(res)
      wx.hideLoading();
      if (res.errcode == 0) {
        var r = res.result;
        wx.requestPayment({
          'appId': appid,
          'timeStamp': r.timeStamp + '',
          'nonceStr': r.nonceStr,
          'package': r.package,
          'signType': 'MD5',
          'paySign': r.paySign,
          'success': function (data) {
                  that.orderquery({ outTradeNo: outTradeNo, appid: appid }, "正在核实中", function success(res) {

              if (res.errcode == 0) {
                if (res.result == 'SUCCESS') {
                  wx.navigateTo({
                    url: '/pages/site/orderList/orderList?types=' + types
                    })
                  console.log(types+"odesrer")
                  // that.order_pendingshipment(outTradeNo, '正在核实中', function success(res) {
                  //   if (res.errcode == 0) {
                  //     wx.navigateTo({
                  //       url: '/pages/site/orderList/orderList?id=' + outTradeNo +'&type='+ types
                  //     })
                  //   } else {

                  //   }

                  // }, function fail(res) {

                  // });

                } else {
                  wx.navigateTo({
                    url: '/pages/site/fail/fail??id=' + outTradeNo + '&types=' + types
                  })
                }

              } else {

              }

            }, function fail(res) {
              wx.navigateTo({
                url: '/pages/site/fail/fail?id=' + outTradeNo + '&types=' + types
              })
              toast.error('支付失败', 1500);
            });
          },
          'fail': function (res) {
            console.log(res);
            wx.navigateTo({
              url: '/pages/site/fail/fail?id=' + outTradeNo + '&types=' + types
            })
          }
        })
      } else {
        toast.error('微信支付失败', 1500);
      }
    }, function fail(res) {
     toast.error('微信支付失败', 1500);
    });
      }
    })
  },
  //微信统一下单接口
  unifiedorder: function (params, message, success, fail) {
    request_util.get_data(static_data.unifiedorder_url, params, message, success, fail);
  },
  //微信订单查询接口
  orderquery: function (params, message, success, fail) {
    request_util.get_data(static_data.orderquery_url, params, message, success, fail);
  },   
  //用户登录
  get_login: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.login_url + '?token=' + token , params, message, success, fail);
      }
     })
  },

  /**
   * 获取首页数据
   * appid:appid
   */
  homeData: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.home_data_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   *  菜品分类列表
   * appid:appid
   */
  getCookClassifylist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_cookclassify_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   *菜品列表
   appid:appid,
   cookClassifyId:cookClassifyId
   */
  cooklist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_cooklist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  
  /**
   * 店内下单
   * "appid" : 1, //appid
         "mainInfoId":1//商家主键
        "sum" : 1, //总金额
        "copies":123,//总份数
        "tableNumber":1,//桌号
        "dinner":"用餐人数"
        "openId":1 //用户id
        "reOrderCooks":[{
        "cookId":1 //菜谱主键
        "cookRuleId":1//菜谱规则主键
        "realPrice":1//实际金额
        "copies":1//份数
        }]
   */
  orderbyin: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.get_orderbyin_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
   * 外卖下单
   * {
     *   "appid" : 1, //appid
        "mainInfoId":1//商家主键
        "sum" : 1, //总金额
        "copies":123,//总份数
        "way":1,//取餐方式 1.预约取餐   2.配送
        "subscribeTime":1,//预约时间
        "desc":1,//备注
        "dinner":"用餐人数"
        "openId":1 //用户id
        "reOrderCooks":[{
        "cookId":1 //菜谱主键
        "cookRuleId":1//菜谱规则主键
        "realPrice":1//实际金额
        "copies":1//份数
        }]
        }
   */
  orderbyout: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.get_orderbyout_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
   * 获取包厢列表
   params:{
           appid:appid,
      }
   */
  getRoomlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_roomlist_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
    * 预约包间
       params:{
        "appid" : 1, //appid
        "mainInfoId":1//商家主键
        "roomId" : 1, //房间id
        "name":123,//联系人
        "phone":1,//手机号码
        "diners":1,//就餐人数
        "reserveTime":1,//预定时间
        "stage":"时间段"
        "openId":1 //用户id
        }
    */
  reserVeroom: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.get_reserveroom_url + '?token=' + token, params, message, success, fail);
      }
    })


  },
  /**
   * 优惠买单
   * params:{
        "appid" : 1, //appid
        "mainInfoId":1//商家主键
        "intPrice" : 1, //参与优惠金额
        "outPrice":123,//不参与优惠金额
        "discounts":1,//折扣额度
        "realPrice":1,//实付金额
        "openId":1 //openId
        }
   */
  discountSorder: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.get_discountsorder_url + '?token=' + token, params, message, success, fail);
      }
    })


  },

  /**
   * 优惠买单列表
   * openId:openId
   */
  getDiscountsorderlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_discountsorderlist_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
   * 获取咨询列表
   * appid:appid
   */
  getInformationlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_informationlist_url + '?token=' + token, params, message, success, fail);
      }
    })

  },

  /**
   * 获取店内订单列表
   * openId:openId
   */
  getShoporderlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_getshoporderlist_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
  * 获取外卖订单列表
  * openId:openId
  */
  getOutorderlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_getoutorderlist_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
  * 获取栏目素材详情
  * 
  */
  getcolumnmaterial: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_columnmaterial_url + '?token=' + token+'&id='+id, {}, message, success, fail);
      }
    })
  },
  /**
 * 获取地址列表
 * 
 */
  getAddressList: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_addressList_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
 * 保存地址
 * 
 */
  saveAddressList: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.save_address_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
/**
 * 更新地址
 * 
 */
  updateAddress: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.put_data(static_data.update_address_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
 * 删除地址
 * 
 */
  deleteAddress: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.delete_data(static_data.delete_address_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })
  }

}