const watermarkurl = require('../../../../config.js').watermarkurl;
var util = require('../../../../utils/util.js');
var detailspage = require('../../../common/switchhomepage/detailspage.js');
let collect = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoId: '',
    verifyFlage: util.getOpenId().verifyFlage,
    openid: util.getOpenId().openid,
    item: {},
    article: {},
    collect: {},
    watermark:''
  },
  viewDetail: function () {
    var that = this;
    var url = 'enterpriseResearch/detail.do';
    var data = that.data;
    util.viewDetail(data.infoId, data.verifyFlage, data.openid, url, function (res) {
    //let articleData = app.towxml.toJson(res.data.data.content,'markdown');
      collect = res.data;
      var item = detailspage.bottomMenu(res.data.conditions, collect.data);
      var tpStore = collect.conditions.tpStore;
      collect.collection_image = tpStore == 'YES' ? util.commons_locale.collection_pitch : util.commons_locale.collection_cancel;
      collect.showView = false;
      collect.modelId = collect.conditions.id;
      collect.share = util.commons_locale.share;    
      item.companyNature = util.entryRenderer("ENTERPRISE_COMPANYNATURE", collect.data.companyNature);
      let parameter = {};
      parameter.id = item.id;
      parameter.researchId = '';
      util.getDetails(parameter, util.commons_locale.enterpriseresearch_dtsurl, function (obj) {
        collect.pageMap = obj.data.pageMap;
        collect = that.contentConversion(collect);
        that.setData({
          item:item,
          collect: collect
        })
      })
    });
  },
  contentConversion: function (collect){
    var that = this;
    let pageMap = collect.pageMap;
    collect.shareholder = that.getShareholder(pageMap.shareholder.content);//公司股东
    collect.directorate = pageMap.directorate.content;//董事会构成
    collect.status = that.getStatus(pageMap.status.content);//经营状况(访谈)
    collect.commerce = that.getCommerce(pageMap.commerce.content);//经营状况(工商)
    collect.team = pageMap.team.content;//团队介绍
    collect.competitor = pageMap.competitor.content;//主营竞争对手
    collect.researchEnterprise = detailspage.changeObjectValue('establishTime', pageMap.researchEnterprise.content, 7);//公司对外投资
    if (pageMap.enterpriseResearch.content.length > 0) {
      collect.enterpriseResearch = pageMap.enterpriseResearch.content[0];//企业研究
    }
    collect.researchCorporation = detailspage.changeObjectValue('establishTime',pageMap.researchCorporation.content,7) ;//法人对外投资
    collect.researchMarket = pageMap.researchMarket.content;//细分市场规模及增速
    collect.FinancingHistory = detailspage.changeObjectValue('financingTime', pageMap.FinancingHistory.content, 7);//融资历史
    collect.AdditionalInformation = pageMap.AdditionalInformation.content; //补充信息

    let  research = collect.enterpriseResearch 
    research.shareholdingStructureNote = detailspage.wxParse('shareholdingStructureNote',research.shareholdingStructureNote, that,'collect.enterpriseResearch');
    research.staffComposition = detailspage.wxParse('staffComposition',research.staffComposition, that,'collect.enterpriseResearch'); 
    research.majorSuppliers = detailspage.wxParse('majorSuppliers',research.majorSuppliers, that,'collect.enterpriseResearch'); 
    research.majorDevelopment = detailspage.wxParse('majorDevelopment',research.majorDevelopment, that,'collect.enterpriseResearch'); 
    research.productionCapacity = detailspage.wxParse('productionCapacity',research.productionCapacity, that,'collect.enterpriseResearch'); 
    research.salesServiceCapacity = detailspage.wxParse('salesServiceCapacity',research.salesServiceCapacity, that,'collect.enterpriseResearch'); 
    research.technologicalStrength = detailspage.wxParse('technologicalStrength',research.technologicalStrength, that,'collect.enterpriseResearch'); 
    research.substituteProducts = detailspage.wxParse('substituteProducts',research.substituteProducts, that,'collect.enterpriseResearch'); 
    research.businessDevelopmentDirection = detailspage.wxParse('businessDevelopmentDirection',research.businessDevelopmentDirection, that,'collect.enterpriseResearch'); 
    research.comparableTransaction = detailspage.wxParse('comparableTransaction',research.comparableTransaction, that,'collect.enterpriseResearch'); 
    research.other = detailspage.wxParse('other',research.other, that,'collect.enterpriseResearch'); 
    research.constitutionBusinessesNote = detailspage.wxParse('constitutionBusinessesNote',research.constitutionBusinessesNote, that,'collect.enterpriseResearch'); //法人对外投资 备注
    research.clientsNote = detailspage.wxParse('clientsNote',research.clientsNote, that,'collect.enterpriseResearch'); //主要客户备注
	  research.researchEnterpriseNote = detailspage.wxParse('researchEnterpriseNote',research.researchEnterpriseNote, that,'collect.enterpriseResearch'); //公司对外投资 备注
    research.shareholderNote = detailspage.wxParse('shareholderNote',research.shareholderNote, that,'collect.enterpriseResearch'); //股东结构备注
    research.teamNote = detailspage.wxParse('teamNote',research.teamNote, that,'collect.enterpriseResearch'); //主要团队备注
    research.stateBusinessNote = detailspage.wxParse('stateBusinessNote',research.stateBusinessNote, that,'collect.enterpriseResearch'); //经营状况访谈备注
    research.stateBusinessNoteCommerce = detailspage.wxParse('stateBusinessNoteCommerce',research.stateBusinessNoteCommerce, that,'collect.enterpriseResearch'); //经营状况工商备注
    research.competitorNote = detailspage.wxParse('competitorNote',research.competitorNote, that,'collect.enterpriseResearch'); //竞争对手备注
    research.enterpriseDynamic = detailspage.wxParse('enterpriseDynamic',research.enterpriseDynamic, that,'collect.enterpriseResearch'); //企业动态
    research.industryDynamic = detailspage.wxParse('industryDynamic',research.industryDynamic, that,'collect.enterpriseResearch'); //行业动态
    research.additionalInformationContent = detailspage.wxParse('additionalInformationContent',research.additionalInformationContent, that,'collect.enterpriseResearch'); //补充信息
    research.marketSizeNote = detailspage.wxParse('marketSizeNote', research.marketSizeNote, that,'collect.enterpriseResearch');//细分市场规模及增速
    
    collect.enterpriseResearch = research;
    return collect;
  },
  getCommerce:function (list) {
    var that = this;
    for (var i = 0; i < list.length; i++) {
      list[i].salesVolume = util.entryRenderer("SALESVOLUME", list[i].salesVolume);
      list[i].netProfit = util.entryRenderer("NETPROFIT", list[i].netProfit);
    }
    return list;
  },
  getStatus: function (list) {
    var that = this;
    for (var i = 0; i < list.length; i++) {
      list[i].salesVolume = util.entryRenderer("SALESVOLUME", list[i].salesVolume);
      list[i].netProfit = util.entryRenderer("NETPROFIT", list[i].netProfit);
    }
    return list;
  },
  getShareholder: function (list) {
    var that = this;
    for (var i = 0; i < list.length; i++) {
      list[i].shareholderType = util.entryRenderer("SHAREHOLDER_TYPE", list[i].shareholderType);
    }
    return list;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userId = wx.getStorageSync('userId') || '';
    if(userId != ''){
      that.setData({
        researchId: options.researchId,
        infoId: options.modelId,
        verifyFlage: options.verifyFlage,
        openid: options.openid,
        // watermark: "background:url('" + watermarkurl + userId + "')"
      })
    }else{
      that.setData({
        researchId: options.researchId,
        infoId: options.modelId,
        verifyFlage: options.verifyFlage,
        openid: options.openid,
        // watermark: "background:url('" + watermarkurl+ options.userId + "')"
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
    util.storeModelDetail(options.currentTarget.dataset.id, util.commons_locale.enterprise_research);
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
  bottomMenuToggle: function (options) {
    var that = this;
    options.demandUrl = 'enterpriseResearch/addDemandInput.do';
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
  },
  showModal: function () {
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
  }
})