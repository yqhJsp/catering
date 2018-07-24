// pages/mall/classify/page.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftData: [],
    appid: '',
    rightData: [],
    fristId: '',
    fileDomain: app.static_data.file_domain_url,
    isHidden: 0,
    carHidden: 0,
    animationData: {},//选择动画
    showModalStatus: false,//隐藏遮罩
    showCarStatus: false,
    goodNum:0,//商品数量
    selectRule: {},
    cookRules: {},
    stuats: 0,
    carstuat:1,
    types: '',
    mainInfo:{},
    /*抛物线*/
    cartList: [],
    chooseGoodArr: [],//购物车的物品列表
    sortedList:{},
    totalNum: 0,//总数量
    totalPay: 0,//总价
    hideCount: true,
    hide_good_box: true,
    needAni: false,
    bus_x:0,
    bus_y:0
  },

  /**
         * 切换规则
         */
  chooseFlower: function (options) {
    var that = this;
    var id = options.currentTarget.id;
    var rules = that.data.cookRules.rules;
    var hasList = that.data.sortedList;
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (id == rule.id) {
        that.setData({
          selectRule: rule,
        });
        break;
      }
    }
  },
  /*选择规格*/
  selectRule: function (e) {
    var that = this;
    var rid = e.currentTarget.dataset.id;
    var list = that.data.rightData;
    for (var i = 0; i < list.length; i++) {
      if (rid == list[i].id) {
        that.setData({
          cookRules: list[i],
          selectRule: list[i].rules[0]
        })
      }
    }
    that.setData({
      showModalStatus: true,//显示遮罩       
    })
    that.setData({//把选中值，放入判断值中
      isHidden: 1,
    })
  },
  /*购物车*/
  toCar: function () {
    var that = this;
    if (that.data.stuats == 0) {
      var animation = wx.createAnimation({//动画
        duration: 500,//动画持续时间
        timingFunction: 'linear',//动画的效果 动画从头到尾的速度是相同的
      })
      animation.translateY(0).step()//在Y轴偏移tx，单位px

      that.animation = animation
      that.setData({
        showCarStatus: true,//显示遮罩       
        animationData: animation.export(),
        stuats: 1,
        carHidden: 1
      })
    } else {
      that.setData({
        showCarStatus: false,//显示遮罩       
        stuats: 0,
        carHidden: 0
      })
    }
  },

  addCart:function(e){
   var that=this;
   var cookId=e.currentTarget.dataset.id;
   var cookRuleId = e.currentTarget.dataset.type;
   that.addGoodToCartFn(e);
   that.setData({
     showModalStatus: false
   })
  },
  addCartFn:function(e){
    //规则长度
    var that=this;
    var len = e.target.dataset.length;
    if (len != 1) {
      that.selectRule(e)
    }
    else{
      that.addGoodToCartFn(e); 
    }
  },
  //添加商品到购物车
  addGoodToCartFn: function (e) {
    var that = this;
    var index=-1;
    var cookId=e.currentTarget.dataset.id;
    var cookRuleId=e.currentTarget.dataset.type;
    var copies =1;
    var chooseGoodArr = that.data.chooseGoodArr;
    var price = parseFloat(e.target.dataset.price);
    var realPrice = copies* Number(price) ;
    var name = e.target.dataset.name;
    var img = e.target.dataset.pic;
    var list = that.data.cartList;
    var ruleName = e.target.dataset.rule;
    var sortedList = that.data.sortedList;
    if (list.length >0) {
      for (var i = 0; i < list.length; i++) {
        if (cookId == list[i].cookId && cookRuleId == list[i].cookRuleId) {
          index = i;
        }
      }
    }
    if(index>-1){
      for (var i = 0; i < list.length; i++) {
        if (cookId == list[i].cookId && cookRuleId == list[i].cookRuleId) {
          var num = list[i].copies;
          list[i].copies= num + 1;
          list[i].realPrice = list[i].realPrice + list[i].price;
          sortedList.copies = list[i].copies;
          that.setData({
            sortedList: sortedList,
            list: list
          })
        }
      }
    }else{
      var order = {
        'cookId': cookId,
        'cookRuleId': cookRuleId,
        'copies': copies,
        'price': price,
        'name': name,
        'cover': img,
        'realPrice': realPrice,
        'ruleName': ruleName
      };
      list.push(order);
      sortedList = order;
      that.setData({
        carstuat:0,
      })
    }
    this.setData({
      cartList: list,
      sortedList: sortedList
    });
    console.log(that.data.cartList)
    that.resetTotalNum();
  },
  //清空购物车
  clearShopCartFn: function (e) {
    this.setData({
      cartList: [],
      totalNum: 0,
      totalPay: 0,
      sortedList: {}
    });
  },
  /**
   * 切换分类
   */
  cutClass: function (e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    that.setData({
      fristId: id
    })
    that.loadProducts(id, that.data.appid);
  },
  //重新计算选择的商品的总数和总价
  resetTotalNum: function () {
    var that = this;
    var totalNum = 0;
    var totalPay = 0;
      var carlist = that.data.cartList;

      if (carlist.length>0) {
        for (var i = 0; i < carlist.length; i++) {
          var goodNum = Number(carlist[i].copies);
          totalNum += goodNum;
          totalPay += Number(carlist[i].price) * goodNum;
      }
    }
    that.setData({
      totalNum: totalNum,
      totalPay: totalPay
    });
  },
  hideModal: function () {
    var that = this;
    that.setData({
      showModalStatus: false,
      showCarStatus: false,
      carHidden:0
    })
  },
  //移除商品的事件
  decreaseGoodToCartFn: function (e) {
    var that=this;
    var index = -1;
    var cookId = e.currentTarget.dataset.id;
    var cookRuleId = e.currentTarget.dataset.type;
    var carlist = that.data.cartList;
    var sortedList = that.data.sortedList;
    if (carlist.length > 0) {
      for (var i = 0; i < carlist.length; i++) {
        if (cookId == carlist[i].cookId && cookRuleId == carlist[i].cookRuleId) {
          index = i;
        }
      }
    }
    if (index > -1) {
      for (var i = 0; i < carlist.length; i++) {
        if (cookId == carlist[i].cookId && cookRuleId == carlist[i].cookRuleId) {
          var num = carlist[i].copies;
          carlist[i].copies = num - 1;
          carlist[i].realPrice = carlist[i].realPrice - carlist[i].price;
          sortedList.copies = carlist[i].copies;
          if (carlist[i].copies<= 0) {
            carlist.splice(index, 1);
            break;
          }
      }
    } 
      that.setData({
        sortedList: sortedList,
        cartList: carlist,
      })
    }
    that.resetTotalNum();
  },

  /*下单*/
  saveOrder: function (e) {
    var that = this;
    var t=e.target.dataset.type;
    var totalNum = that.data.totalNum;
    var totalPay = that.data.totalPay;
    var tableNumber='';
    if (isNaN(totalPay)) {
      totalPay = 0;
    }
    if (that.data.cartList.length != 0) {
      wx.setStorage({
        key: 'orderList',
        data: {
          cartList: that.data.cartList,
          totalNum: totalNum,
          totalPay: totalPay
        }
      });
      if(t==1){
        wx.setStorage({
          key: 'table',
          data: {tableNumber}
        })
        wx.navigateTo({
          url: '../caterOrder/caterOrder?type=' + t,
        })
      }
      else if (t==2){
        wx.navigateTo({
          url: '../parcelOrder/parcelOrder?type=' + t,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var types = options.types;
    var systemInfo = wx.getStorageSync('systemInfo');
    that.busPos = {};
    that.busPos['x'] = 45;//购物车的位置
    that.busPos['y'] = app.globalData.hh - 56;
    //获取maininfo
    wx.getStorage({
      key: 'mainInfo',
      success: function(res) {
        that.setData({
          mainInfo: res.data
        })
      },
    })
    that.setData({
      types: types,
      systemInfo: systemInfo,
      goodsH: systemInfo.windowHeight - 245 - 48
    });
    that.getClassiy();
  },
  busAnimation: function () {
    that.setData({
      needAni: true
    });
    setTimeout(function () {
      that.setData({
        needAni: false
      });
    }, 500);
  },
  //获取菜品分类*/
  getClassiy:function(){
    var that = this;
    wx.getExtConfig({
      success: function (res) {
        var appid = res.extConfig.appid;
        that.setData({
          appid: appid
        })
        app.api_util.getCookClassifylist({ appid: appid }, '', function sussess(res) {
          if (res.errcode == 0) {
            console.log(res.result + "....")
            that.setData({
              leftData: res.result

            })
            if (res.result.length > 0) {
              that.setData({
                fristId: res.result[0].id
              })
              that.loadProducts(that.data.fristId, appid);
            }
            setTimeout(function () {
              wx.hideLoading()
            }, 1000)
          }
        }, function fail(res) {

        })
      },
    })
  },
  //菜品列表
  loadProducts: function (cookClassifyId, appid, ) {
    var that = this;
    app.api_util.cooklist({ cookClassifyId: cookClassifyId, appid: appid }, "", function sussess(res) {
      console.log(res);
      if (res.errcode == 0) {
        that.setData({
          rightData: res.result,
          goodMap: res.result
        })
      }
    }, function fail(res) {
 
    });

  },
  //加入购物车效果
  touchOnGoods: function (e) {
    this.finger = {};
    var topPoint = {};
    this.finger['x'] = e.touches["0"].clientX;//点击的位置
    this.finger['y'] = e.touches["0"].clientY;
    console.log(this.finger['x']+"xxx")
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;

    if (this.finger['x'] > this.busPos['x']) {
      topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x'];
    } else {//
      topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x'];
    }

    this.linePos = app.bezier([this.busPos, topPoint, this.finger], 30);
    this.startAnimation(e);
  },
  startAnimation: function (e) {
    var index = 0, that = this,
      bezier_points = that.linePos['bezier_points'];

    that.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    var len = bezier_points.length;
    index = len
    that.timer = setInterval(function () {
      index--;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index < 1) {
        clearInterval(that.timer);
        that.addGoodToCartFn(e);
        that.setData({
          hide_good_box: true
        })
        return
      }
    },22);
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

  },
  goDetail: function (options) {
    var id = options.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
})