const util = require('../../../../utils/util.js');
// const watermarkurl = require('../../../../config.js').watermarkurl;
const detailspage = require('../../../common/switchhomepage/detailspage.js');
const host = require('../../../../config').host;
let collect = {};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    infoId:'',
    verifyFlage:'',
    openid:'',
    information:{},
    article: {},
    collect:{},
    showModalStatus:false,
    userId:'',
    watermark:'',
    bodybg: ""
  },
  viewDetail:function(){
    var that = this;
	  var user = wx.getStorageSync('user') || {};
    var url = 'information/detail.do';
    var data = that.data;
    util.viewDetail(data.infoId, data.verifyFlage, data.openid,url,function(res){
      let articleData = {}, information = res.data.data;
      that.setData({shareContent: res.data.conditions.content});
      information.upContentList = res.data.content.upContentList;
      for (var i in information.upContentList){
        information.upContentList[i].createTime =  util.format(information.upContentList[i].createTime);
        information.upContentList[i].updateTime =  util.format(information.upContentList[i].updateTime);
      }
      information.content = detailspage.wxParse('content', information.content, that, 'information');
      information = detailspage.bottomMenu(res.data.conditions,information);
	    var tpStore = res.data.conditions.tpStore;
      collect.collection_image = tpStore == 'YES' ? util.commons_locale.collection_pitch : util.commons_locale.collection_cancel;
      collect.showView = false;
      collect.modelId = res.data.data.id;
      collect.share = util.commons_locale.share;
      //collect.emailStatus =  true;
      information.releaseDate = util.format(information.releaseDate,9);
      information.updateTime = util.format(information.updateTime);
      information.tradeStartUpTime = util.interceptionDate(information.tradeStartUpTime,7);
      information.tradeStatus = util.entryRenderer("TRANSACTION_STATE",information.tradeStatus );
      information.tradeCurrency = util.entryRenderer("FINANCING_CURRENCY", information.tradeCurrency);
      information.tradeNature = util.entryRenderer("TRANSACTION_NATURE", information.tradeNature);
      that.setData({
          information:information,
          collect: collect
        })
    });

  },
	bottomMenuToggle:function(options){
    var that= this;
    options.demandUrl = 'information/addDemandInput.do';
    that.verWhetherUnbound(function(){
      if (options.currentTarget.dataset.type == 'inRequirement') {
        util.request({
          url: 'demand/getMaxDemandByRegolatorId.do',
          data: {
            informationId: options.currentTarget.dataset.prerequisite,
            openId: util.getOpenId().openId
          },
          callBack: function (data) {
            if (data.data) {
              that.options = options;
              that.datas = data.data;
              that.showModal(that);
            } else {
              detailspage.bottomMenuToggle(options);
            }
          }
        })
      } else {
        detailspage.bottomMenuToggle(options);
      }
    })
  }, verWhetherUnbound: function (callBack){
    wx.request({
      url: host + 'phone/verWhetherUnbound.do',
      data: {
        openId: util.getOpenId().openId
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          if (!res.data.conditions.openId) {
            wx.showToast({
              title:"微信账号未绑定系统账号！",
              duration:1000,
            })
          } else {
            callBack();
          }
        }
      }
    })
  },
  showModal:function (){
    var that =this;
    var modal = {};
    modal.title = '是否继续对接？';
    modal.contentTitle = '针对本资讯，本机构已有对接需求记录：';
    modal.modelList = [
      { 'name': '提出人：', 'value': that.datas.proposeUser },
      { 'name': '提出时间：', 'value': that.datas.proposeTime },
      { 'name': '对接类型：', 'value': that.datas.typeName },
      { 'name': '对接状态：', 'value': that.datas.statusName }
    ]
  that.setData({
      modal: modal,
      showModalStatus: true
    })
  that.powerDrawer = function powerDrawer(e) {
      if (e.currentTarget.dataset.status == 'confirm') {
        that.setData({
          showModalStatus: false
        })
        detailspage.bottomMenuToggle(that.options);
      } else {
        that.setData({
          showModalStatus: false
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bodybg: host + "phone/wximages/bodybg.png" || ""
    })
    var that = this;
    var userId = wx.getStorageSync('userId') || '';

    if(userId != ''){
      that.setData({
        infoId: options.modelId,
        verifyFlage: options.verifyFlage,
        openid: options.openid,
        userId:userId,
        // watermark: "background:url('" + watermarkurl+ userId + "')"
      })
    }else{
      that.setData({
        infoId: options.modelId,
        verifyFlage: options.verifyFlage,
        openid: options.openid,
        userId:options.userId,
        // watermark: "background:url('" + watermarkurl + options.userId + "')"
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
  onShareAppMessage: function () {
    var that = this
          return {
            title: that.data.information.title,
            desc: that.data.shareContent,
            path: '/pages/upgrade/detailspage/information-dts/information-dts?modelId=' + that.data.infoId + '&verifyFlage=YES&openid=' + that.data.openid + '&userId=' + that.data.userId,
        }
  },

  collection: function (options){
    var that = this;
    if (that.data.collect.collection_image == util.commons_locale.collection_pitch){
      collect.collection_image = util.commons_locale.collection_cancel
    }else{
      collect.collection_image = util.commons_locale.collection_pitch
    }
    util.storeModelDetail(options.currentTarget.dataset.id, util.commons_locale.informationType);
    that.setData({
      collect: collect
    })
  },
  emailShare:function(){
    var that = this;
    wx.request({
      url: host+'email/emailInput.do',
      data:{
        emailUrl: host +'information/detail.do',
        emailId: that.data.infoId,
        emailType: 'information',
        to:that.data.to
      },
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          var emailSubject = res.data.conditions.emailSubject;
          var emailUrl = res.data.conditions.emailUrl;
          var emailText = res.data.conditions.emailText;
            wx.redirectTo({
              url: '../../detailspage/email/email?emailSubject=' + emailSubject + '&&emailText=' + emailText + '&&modelId=' + that.data.infoId + '&&emailUrl=' + emailUrl ,
            })
        }
      }
    })
  }
})
