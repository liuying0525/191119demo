// pages/upgrade/detailspage/information-dts/information-dts.js
var util = require('../../../../utils/util.js');
const host = require('../../../../config').host;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: {},
    feedBackContent: [],
    id: '',
    searchKeyword: '',
    scrollTop:200
  },
  viewDetail: function (options) {
    var that = this;
    wx.request({
      url: host + 'demand/customAddFeedback.do',
      data: {
        id: options.id
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          var conditions = res.data.conditions;
          conditions.proposeTime = util.interceptionDate(conditions.proposeTime,16);
          that.setData({
            collect: res.data
          })
        }
      }
    })
  },
  getFeedBackContent: function (that) {
    wx.request({
      url: host + 'demand/getFeedBackContent.do',
      data: {
        id: that.data.id
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          for (var i in res.data){
            res.data[i].createTime = util.interceptionDate(res.data[i].createTime,16);
            //年月日周时分
            res.data[i].appointedDate = util.temporalStyleConversion(res.data[i].appointedDate);
          }
          that.setData({
            feedBackContent: res.data
          })
        }
      }
    })
  },
  bindKeywordInput: function (e) {
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  dispatch: function () {
    var that = this;
    var user = wx.getStorageSync('user') || {};
    if (that.data.searchKeyword) {
      wx.request({
        url: host + 'demand/requirementFeedback.do',
        data: {
          id: that.data.id,
          content: that.data.searchKeyword,
          openId: user.openid
        },
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          if (res.statusCode == 200) {
            that.getFeedBackContent(that);
          }
        }
      })
    };
    this.setData({
      searchKeyword: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    })
    that.viewDetail(options);
    that.getFeedBackContent(that);
  },
  onChangeShowState: function () {
    var that = this;
    collect.showView = (!that.data.collect.showView)
    that.setData({
      collect: collect
    })
  },
  collection: function (options) {
    var that = this;
    if (that.data.collect.collection_image == util.commons_locale.collection_pitch) {
      collect.collection_image = util.commons_locale.collection_cancel
    } else {
      collect.collection_image = util.commons_locale.collection_pitch
    }
    util.storeModelDetail(options.currentTarget.dataset.id, util.commons_locale.informationType);
    that.setData({
      collect: collect
    })
  },
  navigateBack: function () {
    wx.navigateBack()
  },
  homeBind: function () {
    wx.navigateTo({
      url: '../../../../pages/homepage/homepage',
    })
  }, infoDts:function(options){
    var dataset = options.currentTarget.dataset;
    var nextUrl="";
    if (dataset.type=="information"){
      nextUrl = '../../detailspage/information-dts/information-dts?modelId=' + dataset.infoid + '&verifyFlage=' + util.getOpenId().verifyFlage + '&openid=' + util.getOpenId().openId;
    } else if (dataset.type == "enterprise"){
      nextUrl = '../../detailspage/enterprise-dts/enterprise-dts?modelId=' + dataset.infoid + '&verifyFlage=' + util.getOpenId().verifyFlage + '&openid=' + util.getOpenId().openId;
    }
    wx.navigateTo({
      url: nextUrl
    })
  }, makePhoneCall: function (options){
    var phoneNumber = options.currentTarget.dataset.phonenumber;
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
      })
  }
})