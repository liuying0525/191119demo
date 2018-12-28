<<<<<<< HEAD
const host = require('../../config').host;
=======
const host = require('../../config').host; 
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
const picUrl = require('../../config').picUrl;
var allMenu = require('../../utils/allMenu.js');
var util = require('../../utils/util.js')

Page({
<<<<<<< HEAD
  j_username: function(e) { //获取input输入的值 
=======
  j_username: function (e) {   //获取input输入的值 
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    var that = this;
    that.setData({
      j_username: e.detail.value
    })
  },
<<<<<<< HEAD
  j_password: function(e) { //获取input输入的值
=======
  j_password: function (e) {    //获取input输入的值
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    var that = this;
    that.setData({
      j_password: e.detail.value
    })
    var j_password = that.data.j_password
    if (j_password.length === 0) {
      wx.showToast({
        title: '请输入密码！',
        duration: 2000
      })
    }
  },
  /**
<<<<<<< HEAD
   * 登录
   */
  formSubmit: function(e) {
=======
     * 登录
     */
  formSubmit: function (e) {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    var that = this;
    // e.detail.value.j_username = '牛一'
    // e.detail.value.j_password = 'ml123456'
    if (!e.detail.value.j_username) {
      wx.showToast({
        title: '请输入用户名！',
        duration: 1000
      });
      return;
    }
<<<<<<< HEAD
    if (!e.detail.value.j_password) {
=======
    if (!e.detail.value.j_password){
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      wx.showToast({
        title: '请输入密码！',
        duration: 1000
      });
      return;
    }
<<<<<<< HEAD
    var usernameVal = e.detail.value.j_username;
    var passwordVal = e.detail.value.j_password;
    var user = {};

    if (wx.getStorageSync('user')) {
=======
    var usernameVal = e.detail.value.j_username;   
    var passwordVal = e.detail.value.j_password;   
    var user = {};  
   
    if (wx.getStorageSync('user')){
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      user = wx.getStorageSync('user');

      wx.request({
        url: host + 'phone/login.do',
        data: {
          j_username: usernameVal,
          j_password: passwordVal,
          'openId': user.openid
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
<<<<<<< HEAD
        },
        success: function(res) {
          if (!res.data.message) {
            var customMenuList = res.data.customMenu;
            for (var i in customMenuList) {
              customMenuList[i].wxIconCls = picUrl + customMenuList[i].wxIconCls;
=======
        }, success: function (res) {
       

          if (!res.data.message) {
            var customMenuList = res.data.customMenu;
            for (var i in customMenuList) {
              customMenuList[i].wxIconCls =picUrl + customMenuList[i].wxIconCls;
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
            }
            wx.setStorageSync("customMenu", customMenuList);
            wx.setStorageSync("entrys", res.data.entrys);
            wx.setNavigationBarTitle({
              title: res.data.modelName,
            });
<<<<<<< HEAD
            allMenu.initMap('F', host, function() {});
            that.verifyCustomerViewData();
            var url = '../homepage/homepage?templet=' + res.data.modelType + '&pagePath=' + res.data.pagePath + '&userId=' + res.data.userId;
            // wx.setStorageSync("pagePath", url);
            wx.setStorageSync('userId', res.data.userId); //存储openid
=======
            allMenu.initMap('F', host, function () { });
            that.verifyCustomerViewData();
            var url = '../homepage/homepage?templet=' + res.data.modelType + '&pagePath=' + res.data.pagePath + '&userId=' + res.data.userId;
            // wx.setStorageSync("pagePath", url);
			wx.setStorageSync('userId', res.data.userId);//存储openid
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
            wx.redirectTo({
              url: url
            })
          } else {
            wx.showToast({
<<<<<<< HEAD
              icon: 'none',
=======
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
              title: res.data.message,
              duration: 1000
            });
          }
<<<<<<< HEAD
        },
        fail: function(res) {
=======
        }, fail: function (res) {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
          wx.showToast({
            title: '系统忙，请稍后重试！',
            duration: 1000
          });
        }
      });
<<<<<<< HEAD
    } else {
=======
    }else{
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      wx.showToast({
        title: '用户绑定失败，请联系系统管理员！',
        duration: 2000
      })
    }
  },
  /**
   * 重置
   */
<<<<<<< HEAD
  formReset: function() {

=======
  formReset: function () {
    
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
  },
  /**
   * 页面的初始数据
   */
  data: {

  },
<<<<<<< HEAD
  bindViewTap: function() {
=======
  bindViewTap: function () {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
    wx.navigateTo({
      url: '../upgrade/masterlist/information/information'
    })
  },
<<<<<<< HEAD
  onLoad: function() {
    var that = this;
    util.inintPicUrls(that);
  },
  verifyCustomerViewData: function() {
    var user = wx.getStorageSync('user') || {};
    wx.request({
      url: host + 'information/verifyCustomerViewData.do',
=======
  onLoad:function(){
    var that = this;
    util.inintPicUrls(that);
  },
  verifyCustomerViewData:function(){
    var user = wx.getStorageSync('user') || {};
    wx.request({
      url: host +'information/verifyCustomerViewData.do',
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
      data: {
        openId: user.openid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
<<<<<<< HEAD
      success: function(res) {
=======
      success: function (res) {
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88
        let userMode = {};
        userMode.verifyFlage = res.data.verifyFlage;
        userMode.customersViewNumber = res.data.customersViewNumber;
        wx.setStorageSync('userMode', userMode);
      }
    })
  }
})