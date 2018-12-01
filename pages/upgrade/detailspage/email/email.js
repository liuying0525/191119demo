var util = require('../../../../utils/util.js');
var detailspage = require('../../../common/switchhomepage/detailspage.js');
const host = require('../../../../config').host;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    infoId: '',
    verifyFlage: '',
    openid: '',
    emailSubject:'',
    emailUrl:'',
    emailText:'',
    to:''
  },
  bindKeywordInput: function (e) {
    this.setData({
      to: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync('user') || {};
    var userMode = wx.getStorageSync('userMode') || {};
    that.setData({
      infoId: options.modelId,
      emailSubject: options.emailSubject,
      emailUrl: options.emailUrl,
      emailText: options.emailText,
      backUrl: '../../detailspage/information-dts/information-dts?modelId=' + options.modelId + '&&verifyFlage=' + userMode.verifyFlage + '&&openid=' + user.openid,
    })
  },
  navigateBack: function () {
    wx.navigateBack()
  },
  homeBind: function () {
    wx.navigateTo({
      url: '../../../../pages/homepage/homepage',
    })
  },
  sendEmail:function(){
    var that = this;
    wx.request({
      url: host + 'email/sendMail.do',
      data: {
        to:that.data.to,
        emailSubject: that.data.emailSubject,
        emailUrl: '',
        text: that.data.emailText,
        subject: that.data.emailSubject
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.redirectTo({
            url: that.data.backUrl
          })
        }
      }
    })
  }
})