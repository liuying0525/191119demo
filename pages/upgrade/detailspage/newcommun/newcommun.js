// pages/upgrade/detailspage/information-dts/information-dts.js
var util = require('../../../../utils/util.js');
const host = require('../../../../config').host;
var calendar = require('../../../common/calendar/calendar.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      {
        "demand": "见面会议",
        classname: 'demandColor_n',
        selectid: 2
      }, {
        "demand": "电话会议",
        classname: 'demandColor_n',
        selectid: 3
      }, {
        "demand": "信息咨询",
        classname: 'demandColor_n',
        selectid: 4
      }
    ],
    collect: {},
    feedBackContent: [],
    id: '',
    dateTimePicker:{},
    expectedTimeOne:'',
    expectedTimeOneTwo:'',
    expectedTimeTwo:'',
    expectedTimeTwoTwo:'',
    demandContent:'',
    demandUrl:'',
    prerequisite:'',
    typeCode:'',
    submitUrl:'',
    pagePath:'',
    calendarIsShow:true,
    key:'',
    top:0,
  }, 
  clickBind: function (options) {
    var that = this;
    var types = that.data.types;
	  var dataset = options.currentTarget.dataset;
    for (var i = 0; i < types.length; i++) {
      types[i].classname ='demandColor_n';
    }
    types[dataset.index].classname ="demandColor_y";
    that.setData({
      types: types,
      typeCode: dataset.selectid
    })

   
  },
 
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync('user') || {};
    that.setData({
		demandUrl:options.demandUrl,
		prerequisite:options.prerequisite,
		openId:user.openid
    })
    that.addDemandInput();
  },
  addDemandInput:function(){
	 var that = this;
    wx.request({
      url: host + that.data.demandUrl,
      data: {
        id: that.data.prerequisite,
        openId:that.data.openId
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            collect: res.data.data,
            submitUrl: res.data.conditions.submitUrl,
            pagePath: res.data.pagePath
          })
        }
      }
    })  
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
  },
  dateTimePicker: function(e){
    var that = this;
    var data = {};
    data.calendarIsShow = that.data.calendarIsShow ? false : true;
    data.key = e.currentTarget.dataset.key;
    data.top = e.detail.y + 15;
    that.setData(data);
    calendar.inintcalendar(that);
  },
  cancelDateControl: function () {
    var that = this;
    that.setData({
      calendarIsShow:true
    })
  }, 
  demandContent: function(e){
    this.setData({
      demandContent: e.detail.value
    })
  },
  doSave:function(){
	var that = this;
  var FLAG = true;
  if (!that.data.repeatFlag){
    that.setData({repeatFlag:true})
    if (!that.data.typeCode) {
      wx.showToast({ title: '需求类型不能为空！', duration: 2000 })
      FLAG = false;
    }else if (!that.data.expectedTimeOne) {
      wx.showToast({ title: '时间1不能为空！', duration: 2000 })
      FLAG = false;
    }else if (!that.data.expectedTimeOneTwo) {
      wx.showToast({ title: '时间1不能为空！', duration: 2000 })
      FLAG = false;
    }else if (!that.data.demandContent) {
      wx.showToast({ title: '需求内容不能为空！', duration: 2000 })
      FLAG = false;
    }
    that.setData({ repeatFlag: false })
    if (FLAG) {
      var user = wx.getStorageSync('user') || {};
      var userMode = wx.getStorageSync('userMode') || {};
      wx.request({
        url: host + that.data.submitUrl,
        data: {
          openId: user.openid,
          url: that.data.url,
          expectedTimeOne: that.data.expectedTimeOne,
          expectedTimeOneTwo: that.data.expectedTimeOneTwo,
          expectedTimeTwo: that.data.expectedTimeTwo,
          expectedTimeTwoTwo: that.data.expectedTimeTwoTwo,
          demandContent: that.data.demandContent,
          demandUrl: that.data.demandUrl,
          id: that.data.prerequisite,
          typeCode: that.data.typeCode
        },
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          if (res.statusCode == 200) {
            wx.redirectTo({
              url: that.data.pagePath + '?modelId=' + that.data.prerequisite + '&&verifyFlage=' + userMode.verifyFlage + '&&openid=' + user.openid
            })
          }
        }
      })
    }
  }
  },
   doCancel: function () {
     var that = this;
     var user = wx.getStorageSync('user') || {};
     var userMode = wx.getStorageSync('userMode') || {};
     wx.redirectTo({
       url: that.data.pagePath + '?modelId=' + that.data.prerequisite + '&&verifyFlage=' + userMode.verifyFlage + '&&openid=' + user.openid
     })
   }
})
