// pages/upgrade/detailspage/collectrmation-dts/collectrmation-dts.js
var util = require('../../../../utils/util.js'); 
const host = require('../../../../config').host;
 const watermarkurl = require('../../../../config.js').watermarkurl;
var detailspage = require('../../../common/switchhomepage/detailspage.js');
let collect = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectId:'',
    verifyFlage:'',
    openid:'',
    collect:{},
    watermark:''
  },
  viewDetail:function(){
    var that = this;
    var url = 'industryResearch/detail.do';
    var data = that.data;
    util.viewDetail(data.collectId, data.verifyFlage, data.openid,url,function(res){
	
	  var tpStore = res.data.conditions.tpStore;
	  collect = res.data;
      collect.collection_image = tpStore == 'YES' ? util.commons_locale.collection_pitch : util.commons_locale.collection_cancel;
      collect.showView = false;
      collect.modelId = res.data.data.id;
      collect.share = util.commons_locale.share;
	  collect = that.contentConversion(collect);
        that.setData({
          collect: collect
        })
    });

  },
  contentConversion: function (collect){
    var that = this;
    let info = collect.data;
  info.overview = detailspage.wxParse('overview',info.overview, that,'collect.data'); 
  info.scaleGrowth = detailspage.wxParse('scaleGrowth', info.scaleGrowth, that,'collect.data'); 
  info.industryTrends = detailspage.wxParse('industryTrends', info.industryTrends, that,'collect.data'); 
  info.policyImpact = detailspage.wxParse('policyImpact', info.policyImpact, that,'collect.data'); 
  info.segmentAnalysis = detailspage.wxParse('segmentAnalysis', info.segmentAnalysis, that,'collect.data'); 
  info.industryChain = detailspage.wxParse('industryChain', info.industryChain, that,'collect.data'); 
  info.compareTrade = detailspage.wxParse('compareTrade', info.compareTrade, that,'collect.data'); 
	collect.data = info;
    return collect;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var userId = wx.getStorageSync('userId') || '';
    if(userId != ''){
      that.setData({
        collectId: options.modelId,
        verifyFlage: options.verifyFlage,
        openid: options.openid,
        userId:userId,
        watermark: "background:url('" + watermarkurl + userId + "')"
      })
    }else{
      that.setData({
        collectId: options.modelId,
        verifyFlage: options.verifyFlage,
        openid: options.openid,
        userId:options.userId,
         watermark: "background:url('" + watermarkurl+ options.userId + "')"
      })
    }
    that.viewDetail();
    util.initHead(that);
    showView: (options.showView == "true" ? true : false)
    },
  onChangeShowState: function () {
    var that = this;
    collect.showView = (!that.data.collect.showView)
    that.setData({
      collect:collect
    })
  },
  collection: function (options){
    var that = this;
    if (that.data.collect.collection_image == util.commons_locale.collection_pitch){
      collect.collection_image = util.commons_locale.collection_cancel
    }else{
      collect.collection_image = util.commons_locale.collection_pitch
    }
    util.storeModelDetail(options.currentTarget.dataset.id, util.commons_locale.industry_research);
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
  inRequirement:function(options){
    var that = this;
    wx.request({
      url: host + 'industryResearch/newCustom.do',
      data: {
        id:that.data.collectId
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          var url = res.data.conditions.url;
          var id = res.data.conditions.id;
          var openid = that.data.openid;
          var reportName = res.data.conditions.reportName;
          wx.redirectTo({
            url: '../../detailspage/newcustom/newcustom?url=' + url + '&&reportName=' + reportName + '&&id=' + id + '&&openid=' + openid
          })
        }
      }
    })
  }
})