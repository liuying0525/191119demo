var util = require('../../../utils/util.js');

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },
//   properties: {
//     data: {
//       type: Object,
//       value: null
//     }
//   }
// })

function getInforMationSearchList(result, aPageNumber) {
  var that = this;
  var userMode = wx.getStorageSync('userMode') || {};
  let searchList = result.rows;
  for (var i = 0; i < searchList.length; i++) {
    searchList[i].outContent = util.characterConversion(searchList[i].outContent);
    searchList[i].tradeStatus = util.entryRenderer("TRANSACTION_STATE", searchList[i].tradeStatus);
    if (searchList[i].tradeCurrency) {
      var tradeCurrencys = searchList[i].tradeCurrency.split(',');
      var tradeCurrency = '';
      for (var j in tradeCurrencys) {
        tradeCurrency += util.entryRenderer("FINANCING_CURRENCY", tradeCurrencys[j]) + '/';
      }
      if (tradeCurrency.length > 0) {
        searchList[i].tradeCurrency = tradeCurrency.substring(0, tradeCurrency.length - 1);
      }
    }
    searchList[i].createTime = util.format(searchList[i].createTime);
    searchList[i].releaseDate = util.format(searchList[i].releaseDate);
    searchList[i].outContent = util.characterConversion(searchList[i].outContent);
    searchList[i].contentUpDate = util.interceptionDate(searchList[i].contentUpDate, 10);
    aPageNumber++;
    if (aPageNumber > userMode.customersViewNumber && userMode.verifyFlage == 'YES') {
      searchList[i].titleCss = 'titleDullGrey';
      searchList[i].urlName = '';
    } else {
      searchList[i].urlName = 'informationDts';
      if (searchList[i].readingStatus) {
        searchList[i].titleCss = 'titleChange';
      } else {
        searchList[i].titleCss = 'title';
      }
    }
  }
  return searchList;
}

function getEnterpriseSearchList(result, aPageNumber) {
  var that = this;
  let searchList = result.rows;
  var userMode = wx.getStorageSync('userMode') || {};
  for (var i = 0; i < searchList.length; i++) {
    aPageNumber++;
    if (aPageNumber > userMode.customersViewNumber && userMode.verifyFlage == 'YES') {
      searchList[i].titleCss = 'titleDullGrey';
      searchList[i].urlName = '';
    } else {
      searchList[i].urlName = 'enterpriseDts';
      if (searchList[i].readingStatus) {
        searchList[i].titleCss = 'titleChange';
      } else {
        searchList[i].titleCss = 'title';
      }
    }
  }
  return searchList;
}

function getEnterpriseResearchSearchList(searchList, aPageNumber) {
  var that = this;
  var userMode = wx.getStorageSync('userMode') || {};
  for (var i = 0; i < searchList.length; i++) {
    aPageNumber++;
    if (aPageNumber > userMode.customersViewNumber && userMode.verifyFlage == 'YES') {
      searchList[i].titleCss = 'titleDullGrey';
      searchList[i].urlName = '';
    } else {
      searchList[i].urlName = 'enterpriseResearchDts';
      if (searchList[i].readingStatus) {
        searchList[i].titleCss = 'titleChange';
      } else {
        searchList[i].titleCss = 'title';
      }
    }
  }
  return searchList;
}

function getIndustryResearchSearchList(searchList, aPageNumber) {
  var that = this;
  var userMode = wx.getStorageSync('userMode') || {};
  for (var i = 0; i < searchList.length; i++) {
    aPageNumber++;
    searchList[i].createTime = util.interceptionDate(searchList[i].createTime, 10);
    if (aPageNumber > userMode.customersViewNumber && userMode.verifyFlage == 'YES') {
      searchList[i].titleCss = 'titleDullGrey';
      searchList[i].urlName = '';
    } else {
      searchList[i].urlName = 'industryResearchDts';
      if (searchList[i].readingStatus) {
        searchList[i].titleCss = 'titleChange';
      } else {
        searchList[i].titleCss = 'title';
      }
    }
  }
  return searchList;
}

function getCommunSearchList(result, that) {
  var userMode = wx.getStorageSync('userMode') || {};
  let searchList = result.rows;
  for (var i = 0; i < searchList.length; i++) {
    searchList[i].urlName = 'communDts';
    var time = "";
    if (searchList[i].expectedTimeOne || searchList[i].expectedTimeTwo || searchList[i].expectedTimeOneTwo || searchList[i].expectedTimeTwoTwo) {
      if (searchList[i].expectedTimeOne && searchList[i].expectedTimeOneTwo) {
        time = util.format(searchList[i].expectedTimeOne) + "~" + util.format(searchList[i].expectedTimeOneTwo);
      }
      if (searchList[i].expectedTimeTwo && searchList[i].expectedTimeTwoTwo) {
        if (time == "") {
          time = util.format(searchList[i].expectedTimeTwo) + "~" + util.format(searchList[i].expectedTimeTwoTwo);
        } else {
          time = time + "," + util.format(searchList[i].expectedTimeTwo) + "~" + util.format(searchList[i].expectedTimeTwoTwo);
        }
      }
    }
    searchList[i].expectedTime = time;
    searchList[i].demandType = util.entryRenderer("DEMAND_TYPE", searchList[i].demandType);
    if (util.entryRenderer("DEMAND_STATUS", searchList[i].status)) {
      searchList[i].status = util.entryRenderer("DEMAND_STATUS", searchList[i].status);
    } else {
      searchList[i].status = 'ML已反馈'
    }
  }
  that.communDts = function(options) {
    wx.navigateTo({
      url: '../../detailspage/demand-feedback/demand-feedback?id=' + options.currentTarget.dataset.demandid
    })
  }
  return searchList;
}

function getCustomSearchList(result, that) {
  let searchList = result.rows;
  for (var i = 0; i < searchList.length; i++) {
    if (util.entryRenderer("DEMAND_STATUS", searchList[i].status)) {
      searchList[i].status = util.entryRenderer("DEMAND_STATUS", searchList[i].status);
    } else {
      searchList[i].status = 'ML已反馈'
    }
    searchList[i].urlName = 'communDts';
  }
  that.communDts = function(options) {
    wx.navigateTo({
      url: '../../detailspage/demand-feedback/demand-feedback?id=' + options.currentTarget.dataset.demandid
    })
  }
  return searchList;
}

function getCollectionList(searchList, that) {
  for (var i = 0; i < searchList.length; i++) {
    if (searchList[i].tmInformation && searchList[i].tmInformation.tradeStatus) {
      searchList[i].tmInformation.tradeStatus = util.entryRenderer("TRANSACTION_STATE", searchList[i].tmInformation.tradeStatus);
    }
    if (searchList[i].tmInformation && searchList[i].tmInformation.tradeScale) {
      searchList[i].tmInformation.tradeScale = util.entryRenderer("REGOLATOR_SINGLEINVESTLIMIT", searchList[i].tmInformation.tradeScale);
    }
    if (searchList[i].tmInformation && searchList[i].tmInformation.tradeCurrency) {
      searchList[i].tmInformation.tradeCurrency = util.entryRenderer("FINANCING_CURRENCY", searchList[i].tmInformation.tradeCurrency);
    }
    if (searchList[i].tmInformation && searchList[i].tmInformation.createTime) {
      searchList[i].tmInformation.createTime = util.format(searchList[i].tmInformation.createTime);
    }
  }
  return searchList;
}
module.exports = {
  getInforMationSearchList: getInforMationSearchList,
  getEnterpriseSearchList: getEnterpriseSearchList,
  getCommunSearchList: getCommunSearchList,
  getEnterpriseResearchSearchList: getEnterpriseResearchSearchList,
  getIndustryResearchSearchList: getIndustryResearchSearchList,
  getCustomSearchList: getCustomSearchList,
  getCollectionList: getCollectionList
}