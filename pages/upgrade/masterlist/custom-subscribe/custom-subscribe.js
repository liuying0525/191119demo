// pages/upgrade/masterlist/setting.js
const host = require('../../../../config').host;
var menu = require('../../../common/subscribe/menu.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: true,
    parameter: {},
    moduleCode: 'H' //右侧参数清单，参考allmenu.js
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var me = this;
    menu.init(me);
  },
  keywordSearch: function() {
    var me = this;
    var user = wx.getStorageSync('user') || {};
    var data = me.data.checkedItem;
    wx.request({
      url: host + 'customSubscribe/setting.do',
      data: {
        'openId': user.openid,
        'json': JSON.stringify(data)
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.statusCode == 200) {
          if (data.hasOwnProperty("whetherSubscribe") && data["whetherSubscribe"] == "YES") {
            wx.showModal({
              title: '订阅成功',
              content: res.data.msg || '您已经成功订阅',
            })
          }
          wx.setStorageSync('subscribecheckedItem', data);
          setTimeout(function() {
            wx.reLaunch({
              url: '../../../homepage/homepage?templet=information&pagePath=information/list.do&userId=' + user
            });
          }, 1500);

        } else {
          wx.showModal({
            title: '请求失败',
            content: res.errMsg,
          })
        }
      },
      fail: function(error) {
        wx.showModal({
          title: '请求失败',
          content: error.errMsg,
        })
      }
    })

  }
})