// pages/upgrade/detailspage/information-dts/information-dts.js
const util = require('../../../../utils/util.js'); 
// const watermarkurl = require('../../../../config.js').watermarkurl;
const detailspage = require('../../../common/switchhomepage/detailspage.js');
let collect = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoId:'',
    verifyFlage:'',
    openid:'',
    item:{},
    collect:{},
    watermark:''
  },
  viewDetail:function(){
    var that = this;
    var url = 'enterprise/detail.do';
    var data = that.data;
    util.viewDetail(data.infoId, data.verifyFlage, data.openid,url,function(res){
	  var tpStore = res.data.conditions.tpStore;
      collect.collection_image = tpStore == 'YES' ? util.commons_locale.collection_pitch : util.commons_locale.collection_cancel;
      collect.showView = false;
      collect.modelId = res.data.data.id;
      collect.share = util.commons_locale.share;
	  res.data.data.registeredCapital = util.entryRenderer("REGISTERED_CAPITAL", res.data.data.registeredCapital);
	  res.data.data.companyNature = util.entryRenderer("ENTERPRISE_COMPANYNATURE", res.data.data.companyNature); 
	  let parameter = {};
		  parameter.id = res.data.data.id;
		util.getDetails(parameter,util.commons_locale.enterprise_dtsurl,function(obj){
			var pageMap = obj.data.pageMap;
      let item = res.data.data;
	  item = detailspage.bottomMenu(res.data.conditions,item);
      item.brand = pageMap.brand.content;
      item.shareholder = that.getShareholder(pageMap.shareholder.content);
      item.directorate = pageMap.directorate.content;
      item.status = that.getStatus(pageMap.status.content);
      item.commerce = that.getCommerce(pageMap.commerce.content);
      item.team = pageMap.team.content;
      item.competitor = pageMap.competitor.content;
      item.other = detailspage.wxParse('other', item.other , that,'item');
			that.setData({
        item: item,
			 collect: collect
			})
		})
    });

  },
 getCommerce:function(list) {
  var that = this;
  for (var i = 0; i < list.length; i++) {
	list[i].salesVolume = util.entryRenderer("SALESVOLUME", list[i].salesVolume );
	list[i].netProfit = util.entryRenderer("NETPROFIT", list[i].netProfit );
  }
  return list;
}, 
getStatus:function(list) {
  var that = this;
  for (var i = 0; i < list.length; i++) {
	list[i].salesVolume = util.entryRenderer("SALESVOLUME", list[i].salesVolume );
	list[i].netProfit = util.entryRenderer("NETPROFIT", list[i].netProfit );
  }
  return list;
},
getShareholder:function(list) {
  var that = this;
  for (var i = 0; i < list.length; i++) {
	list[i].shareholderType = util.entryRenderer("SHAREHOLDER_TYPE", list[i].shareholderType );
  }
  return list;
},
	bottomMenuToggle:function(options){
    var that = this;
		options.demandUrl = 'enterprise/addDemandInput.do';
    if (options.currentTarget.dataset.type == 'inRequirement') {
    util.request({
      url: 'demand/getMaxDemandByRegolatorId.do',
      data: {
        enterpriseId: options.currentTarget.dataset.prerequisite,
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
    }else{
      detailspage.bottomMenuToggle(options);
    }
}, showModal: function () {
  var that = this;
  var modal = {};
  modal.title = '是否继续对接？';
  modal.contentTitle = '针对本企业，本机构已有对接需求记录：';
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
    var that = this;
    var userId = wx.getStorageSync('userId') || '';
    if(userId != ''){
      that.setData({
        infoId: options.modelId,
        verifyFlage: options.verifyFlage,
        openid: options.openid,
        userId:userId,
        // watermark: "background:url('" + watermarkurl + userId + "')"
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
  collection: function (options){
    var that = this;
    if (that.data.collect.collection_image == util.commons_locale.collection_pitch){
      collect.collection_image = util.commons_locale.collection_cancel
    }else{
      collect.collection_image = util.commons_locale.collection_pitch
    }
    util.storeModelDetail(options.currentTarget.dataset.id, util.commons_locale.enterpriseStore);
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
  }
})