//app.js
const static_data = require('./utils/static_data.js');
const request_util = require('./utils/request_util.js');
const api_util = require('./utils/api_mall_util.js');
const toast = require('./utils/toast_util.js');
const WxParse = require('./plugin/wxParse/wxParse.js');
var loginStatus = true;
App({
  token: '',
  static_data: static_data,
  request_util: request_util,
  api_util: api_util,
  WxParse: WxParse,
  toast: toast,
  //获取会话失败的弹窗提醒
  getSessionError: function () {
    wx.showModal({
      title: '提示',
      content: '获取用户会话失败,请重新进入',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    })
  },
  onShow: function () {
    console.log("onShow")
//     this.getSession();
//      this.getUserInfo();
  },
  /**
     * 同步服务器用户信息
     */
  synUserInfo: function (userInfo) {
          var that = this;
          var member = that.globalData.member;
          var memberData = {
                  id: member.id,
                  avatarUrl: userInfo.avatarUrl,
                  nickName: userInfo.nickName,
                  appid: member.appid,
                  version: member.version,
                  gender: userInfo.gender,
                  city: userInfo.city,
                  province: userInfo.province,
                  country: userInfo.country,
                  language: userInfo.language,
                  openId: member.openId
          }
          wx.setStorageSync('member', memberData);
          api_util.get_login(memberData, "", function success(data) {
                  that.globalData.member = memberData;
          }, function (data) {

          });
  },
  /**
   * 强制授权操作
   */
  getPromission: function () {
          var that = this;
          if (!loginStatus) {
                  wx.openSetting({
                          success: function (data) {
                                  if (data) {
                                          if (data.authSetting["scope.userInfo"] == true) {
                                                  loginStatus = true;
                                                  wx.getUserInfo({
                                                          withCredentials: false,
                                                          success: function (data) {
                                                                  console.info("2成功获取用户返回数据");
                                                                  console.info(data.userInfo);
                                                                  that.synUserInfo(data.userInfo);
                                                          },
                                                          fail: function () {
                                                                  console.info("2授权失败返回数据");
                                                          }
                                                  });
                                          }
                                  }
                          },
                          fail: function () {
                                  console.info("设置失败返回数据");
                          }
                  });
          } else {
                  wx.login({
                          success: function (res) {
                                  if (res.code) {
                                          wx.getUserInfo({
                                                  withCredentials: false,
                                                  success: function (data) {
                                                          console.info("1成功获取用户返回数据");
                                                          console.info(data.userInfo);
                                                          that.synUserInfo(data.userInfo);
                                                  },
                                                  fail: function () {
                                                          console.info("1授权失败返回数据");
                                                          loginStatus = false;
                                                          // 显示提示弹窗
                                                          wx.showModal({
                                                                  title: '温馨提示',
                                                                  content: '为了更好的体验，请允许授权',
                                                                  showCancel: false,
                                                                  success: function (res) {
                                                                          wx.openSetting({
                                                                                  success: function (data) {
                                                                                          if (data) {
                                                                                                  if (data.authSetting["scope.userInfo"] == true) {
                                                                                                          loginStatus = true;
                                                                                                          wx.getUserInfo({
                                                                                                                  withCredentials: false,
                                                                                                                  success: function (data) {
                                                                                                                          console.info("3成功获取用户返回数据");
                                                                                                                          console.info(data.userInfo);
                                                                                                                          that.synUserInfo(data.userInfo);
                                                                                                                  },
                                                                                                                  fail: function () {
                                                                                                                          console.info("3授权失败返回数据");
                                                                                                                  }
                                                                                                          });
                                                                                                  }
                                                                                          }
                                                                                  },
                                                                                  fail: function () {
                                                                                          console.info("设置失败返回数据");
                                                                                  }
                                                                          });
                                                                  }
                                                          });
                                                  }
                                          });
                                  }
                          },
                          fail: function () {
                                  console.info("登录失败返回数据");
                          }
                  });
          }
  },
  getUserInfo: function () {
    var that = this;
    var status = true;
    var member = wx.getStorageSync('member') || {};
    that.globalData.member = member;
    if (member.avatarUrl.length == 0) {
      wx.setStorageSync('userid', member.id);
      //获取用户信息
      wx.getUserInfo({
        success: function (res) {
     
          var userInfo = res.userInfo;
          that.globalData.userInfo = res.userInfo;
          console.log(res.userInfo);
          member.avatarUrl = userInfo.avatarUrl;
          member.city = userInfo.city;
          member.country = userInfo.country;
          member.gender = userInfo.gender;
          member.language = userInfo.language;
          member.nickName = userInfo.nickName;
          member.province = userInfo.province;
          member.updateUserId = member.createUserId; 
          member.address = {}
          api_util.get_login(member, "", function (data) {
            console.log("授权了");
            console.log(data);
          }, function (data) {
                  that.globalData.member = member;
          });
        },
        fail: function (res) {
          console.log("不授权了");
          wx.showModal({
            title: '提示',
            content: '为了更好的功能体验，请允许授权用户信息',
            success: function (res) {
              that.getUserInfo();
            }
          })
        }
      })
    }
  },
  /**
   * 获取登录接口
   * */
  getSession: function (callback) {
    var that = this;
    wx.getExtConfig({
      success: function (res) {
        var appid = res.extConfig.appid;
        var createUserId = res.extConfig.createUserId;
        wx.login({
          success: function (res) {
            request_util.jscode2_session({
              appid: appid,
              js_code: res.code,
              createUserId: createUserId
            }, function success(result) {
              if (result.errcode == 0) {
                      
                var openid = result.result.openid;
                var sessionkey = result.result.session_key;
                var token = result.result.token;
                var member = result.result.member;
                wx.setStorageSync('token', token);
                wx.setStorageSync('openid', openid);
                wx.setStorageSync('sessionkey', sessionkey);
                wx.setStorageSync('member', member);
                wx.setStorageSync('appid', appid);

                wx.setStorage({
                        key: "token",
                        data: token
                })
                that.globalData.token = 1;
                that.globalData.token = 1;
                that.globalData.member = member;
                that.getPromission();
                if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                }
              } else {
                that.getSessionError();

              }

            }, function fail(result) {
              that.getSessionError();
            });
          }
        })
      }
    })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.getSystemInfo({//  获取页面的有关信息
      success: function (res) {
            wx.setStorageSync('systemInfo', res)
            var ww = res.windowWidth;
            var hh = res.windowHeight;
            that.globalData.ww = ww;
            that.globalData.hh = hh;
          }
        });
    that.getSession();
  },

  globalData: {
    token: '',
    userInfo: null,
    createUserId:0,
    mainInfo:{},
    member: {}
  },
  /*购物车抛物线*/
  bezier: function (pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }
    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0];//点击
      pointB = points[1];//中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  }
})