const host = require('../config').host;
const picUrl = require('../config').picUrl;

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function format(date) {
  if (date) {
    return date = date.substring(0, 10);
  }
  return '';
}

function interceptionDate (date,length) {
  if (date && date.length >= length){
    return date = date.substring(0, length);
  }
  return date;
}

function getSearchMusic(condition, parameter, callback) {
   // debugger;
    var user = wx.getStorageSync('user') || {};
    var userMode = wx.getStorageSync('userMode') || {};
	parameter.openId = user.openid;
	parameter.verifyFlage = userMode.verifyFlage;
	parameter.customersViewNumber = userMode.customersViewNumber;
  wx.request({
    url: condition.url,
    data: {
      rows: condition.callbackcount,  //返回数据的个数
      page: condition.searchPageNum,
      parameter: JSON.stringify(parameter)
    },
    method: 'POST',
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res);
      }
    }
  })
}
function readingStatus(modelId, modelType, nextUrl) {
  var user = wx.getStorageSync('user') || {};
  var userId = wx.getStorageSync('userId') || '';
  var userMode = wx.getStorageSync('userMode') || {};
  var url = host + 'tpRecordcliReadingStatus/readingStatus.do';
  wx.request({
    url: url,
    data: {
      modelId: modelId,
      modelType: modelType,
      openid: user.openid
    },
    method: 'POST',
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    success: function () {
      
      wx.navigateTo({
        url: nextUrl + '?modelId=' + modelId + '&verifyFlage=' + userMode.verifyFlage + '&openid=' + user.openid + '&userId=' + userId,
      })
    }
  })
}

function viewDetail(id, verifyFlage, openid, url, callback) {
  wx.request({
    url: host + url,
    data: {
      id: id,
      openid: openid,
      verifyFlage: verifyFlage
    },
    method: 'POST',
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res);
      }
    }
  })
}
function characterConversion(mdContent) {
  const _ts = this;
  let s = '';
  if (!mdContent) {
    return '';
  };
  s = mdContent.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, "\"");
  s = s.replace(/&ldquo;/g, '"');
  s = s.replace(/&rdquo;/g, '"');
  return s;
}
function entryRenderer(key, value) {
  if (!value) { return ""; }
  var obj = value.split(",");
  if (obj.length > 1) {
    var sub = "";
    for (var i = 0; i < obj.length; i++) {
      sub += this.getEntry(key, obj[i]) + "/";
    }
    if (sub != "") { sub = sub.substring(0, (sub.length - 1)); }
    return sub
  }
  return this.getEntry(key, value);
}
function getEntry(key, value) {
  var entrys = wx.getStorageSync('entrys') || {};
  if (!entrys) {
    return function (value) {
      return value;
    };
  }
  var entryMap = entrys[key];
  if (entryMap != null && entryMap[value] != null) {
    return entryMap[value].zh_CN;
  } else {
    return '';
  }
}
function storeModelDetail(modelId, modelType) {
  var user = wx.getStorageSync('user') || {};
  var userMode = wx.getStorageSync('userMode') || {};
  wx.request({
    url: host + 'store/add.do',
    method:'POST',
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    data: {
      modelId: modelId,
      modelType: modelType,
      openid: user.openid
    }
  })
}
  /**
   *
   * url：请求路径
   * parameter：参数
   * callback：回调
   */
 function getDetails(parameter,url,callback){
  wx.request({
	  url:host+url,
	  data:{
		parameter: JSON.stringify(parameter)
	  },
	  method:'POST',
	  header: { "Content-Type": "application/x-www-form-urlencoded" },
	  success: function (res) {
	   if (res.statusCode == 200) {
		 callback(res);
	   }
    }
  })
}
function redirect(options){
	wx.redirectTo({
		url:options.url
	})
}
function inintInput(obj){
  obj.bindKeywordInput = function (e) {
      obj.setData({
        searchKeyword: e.detail.value
      })
    }
  // 重置按钮点击事件
    obj.resetBtnClick = function (e) {
    obj.setData({
      searchKeyword: ''
    })
  }
}
var commons_locale = {
  page:1,
  rows:25,
  collection_cancel: '../../../../images/collection_i.png',
  collection_pitch: '../../../../images/collection_b.png',
  homepage: '../../../../images/homepage.png',
  share:"../../../../images/mail.png",
  informationType:"INFORMATION",
  enterpriseStore:"ENTERPRISE_STORE",
  enterprise_research:"ENTERPRISE_RESEARCH",
  industry_research:"INDUSTRY_RESEARCH",
  enterprise_dtsurl:'enterprise/getDetails.do',
  enterpriseresearch_dtsurl:'enterpriseResearch/getDetails.do',
  other_enterprise_infourl:'information/theEnterpriseListInput.do',
  enterprise_detailurl:'enterprise/detail.do',
  similar_enterpriseurl:'enterprise/similarEnterpriseList.do',
  industry_researchotherurl:'industryResearch/otherListInput.do'
}
 function initHead(obj) {
  obj.navigateBack = function () {
    wx.navigateBack()
  }
  obj.skipHomePage = function skipHomePage() {
    wx.reLaunch({
      url:'../../../index/index',
    })
    // var current = getCurrentPages();
    // wx.navigateBack({
    //   delta: current.length-1
    // })
  }
  obj.homeBind = function (e) {
    var url = wx.getStorageSync("pagePath") || {};
    var path = e.currentTarget.dataset.path;
    wx.reLaunch({
      url:path+url,
    })
  }
}
var system_val = {
	// openId:user.openId,
	// verifyFlage =userMode.verifyFlage,
	// customersViewNumber = userMode.customersViewNumber,
	page:1,
	rows:25
}
function pagingBottom(obj,data){
  var rows = obj.data.callbackcount;
  var totalPage = parseInt((data.data.total + rows - 1) / rows);
  var searchList = data.data.rows;
  if (searchList.length > 0) {
    if (data.data.currentPage >= totalPage) {//
      obj.setData({
        searchLoading: true, //隐藏
        searchLoadMore: false
      });
    } else {
      obj.setData({
        searchLoading: true,//显示
        searchLoadMore: true
      });
    }
  } else {
    obj.setData({
      searchLoading: true,//隐藏
      searchLoadMore: false
    });
  }
}
var picUrls = {
  account: picUrl+'account.png',
  associated: picUrl + 'associated.png',
  collection: picUrl + 'collection.png',
  collection_b: picUrl + 'collection_b.png',
  collection_i: picUrl + 'collection_i.png',
  company: picUrl + 'company.png',
  com_res: picUrl + 'com_res.png',
  customer: picUrl + 'customer.png',
  demand_a: picUrl + 'demand_a.png',
  demand_b: picUrl + 'demand_b.png',
  dem_commun: picUrl + 'dem_commun.png',
  dem_cus: picUrl + 'dem_cus.png',
  false_0: picUrl + 'false_0.png',
  industry: picUrl + 'industry.png',
  inform: picUrl + 'inform.png',
  left: picUrl + 'left.png',
  loading: picUrl + 'loading.gif',
  login: picUrl + 'login.jpg',
  M: picUrl + 'M.png',
  mail: picUrl + 'mail.png',
  menu: picUrl + 'menu.png',
  M_logo: picUrl + 'M_logo.png',
  right: picUrl + 'right.png',
  screen: picUrl + 'screen.png',
  screening: picUrl + 'screening.png',
  sign: picUrl + 'sign.png',
  sign_b: picUrl + 'sign_b.png',
  time: picUrl + 'time.png',
  up: picUrl + 'up.png',
  username: picUrl + 'username.png',
  password: picUrl + 'password.png',
}

function inintPicUrls(obj){
  obj.setData({
    account: picUrl + 'account.png',
    associated: picUrl + 'associated.png',
    collection: picUrl + 'collection.png',
    collection_b: picUrl + 'collection_b.png',
    collection_i: picUrl + 'collection_i.png',
    company: picUrl + 'company.png',
    com_res: picUrl + 'com_res.png',
    customer: picUrl + 'customer.png',
    demand_a: picUrl + 'demand_a.png',
    demand_b: picUrl + 'demand_b.png',
    dem_commun: picUrl + 'dem_commun.png',
    dem_cus: picUrl + 'dem_cus.png',
    false_0: picUrl + 'false.png',
    industry: picUrl + 'industry.png',
    inform: picUrl + 'inform.png',
    left: picUrl + 'left.png',
    loading: picUrl + 'loading.gif',
    login: picUrl + 'login.jpg',
    M: picUrl + 'M.png',
    mail: picUrl + 'mail.png',
    menu: picUrl + 'menu.png',
    M_logo: picUrl + 'M_logo.png',
    right: picUrl + 'right.png',
    screen: picUrl + 'screen.png',
    screening: picUrl + 'screening.png',
    sign: picUrl + 'sign.png',
    sign_b: picUrl + 'sign_b.png',
    time: picUrl + 'time.png',
    up: picUrl + 'up.png',
    username: picUrl + 'username.png',
    password: picUrl + 'password.png',
  })
}
function getOpenId(){
  var user = wx.getStorageSync('user') || {};
  var userMode = wx.getStorageSync('userMode') || {};
  userMode.openId = user.openid;
  return userMode;
}
  function request(options) {
    var url = options.url ? options.url : '';
    var data = options.data ? options.data : {};
    var callBack = options.callBack ? options.callBack : {};
    wx.request({
      url: host + url,
      data: data,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.statusCode == 200) {
          callBack(res.data);
        }
      }
    })
  }

  function promptJump(title, timeOut,url) {
    wx.showToast({
      title: title ? title:'暂无提示信息！',
      duration: timeOut ? timeOut:1000,
      success: function (res) {
        wx.reLaunch({
          url: url,
        })
      }
    })
  }
  function temporalStyleConversion(val) {
    if (val) {
      val = val.replace(/-/g, '/');
      var changeDate = new Date(val);
      var str = new Array('日', '一', '二', '三', '四', '五', '六');
      var fullYear = changeDate.getFullYear();//年
      var month = changeDate.getMonth() + 1;//月
      var date = changeDate.getDate();//日
      var day = changeDate.getDay();//星期几
      var hours = changeDate.getHours() < 10 ? '0' + changeDate.getHours() : changeDate.getHours();//小时
      var minutes = changeDate.getMinutes() < 10 ? '0' + changeDate.getMinutes() : changeDate.getMinutes();//分钟
      var finalDate = fullYear+ '年' + month + '月' + date + '日 (周' + str[parseInt(day)] + ') '+ hours + ':' + minutes;
      return finalDate;
    }
    return date;
  }
module.exports = {
  formatTime: formatTime,
  getSearchMusic: getSearchMusic,
  readingStatus: readingStatus,
  viewDetail: viewDetail,
  characterConversion: characterConversion,
  entryRenderer: entryRenderer,
  getEntry: getEntry,
  format: format,
  storeModelDetail: storeModelDetail,
  commons_locale: commons_locale,
  getDetails:getDetails,
  redirect:redirect,
  system_val:system_val,
  inintInput: inintInput,
  initHead: initHead,
  pagingBottom: pagingBottom,
  picUrls: picUrls,
  inintPicUrls: inintPicUrls,
  interceptionDate: interceptionDate,
  getOpenId: getOpenId,
  request: request,
  promptJump: promptJump,
  temporalStyleConversion: temporalStyleConversion
}
