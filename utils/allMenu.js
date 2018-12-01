var menu_data = [];
var all_menu_data = [];
var setting_data = {};
var customSubscribe = []
var menuMap = {
  idMapper: {},
  init: false
};
/*
registerPlace:注册地
industry:所属行业
hotspot:热点细分
tradeStatus:交易状态
tradeCurrency:交易币种
tradeScale:交易规模
equityChange:股权变动
tradeRounds:交易轮数
tradeNature:交易性质
companyNature:公司性质
haveInformation:有无资讯
registeredCapital:注册资本
     salesAmount:销售额
    retainedProfits:净利润
demandStatus:需求状态
demandType:需求类型
 */

var module_data = {
  A: ['industry', 'hotspot', 'tradeStatus', 'tradeScale', 'equityChange', 'tradeCurrency', 'tradeRounds', 'tradeNature', 'companyNature', 'registerPlace', 'salesAmount','retainedProfits'], //资讯  
  B: ['industry', 'hotspot', 'registeredCapital', 'companyNature', 'salesAmount', 'retainedProfits', 'registerPlace'], //企业库
  C: ['industry', 'hotspot', 'registeredCapital', 'companyNature', 'salesAmount', 'retainedProfits', 'registerPlace'], //企业研究
  D: ['industry', 'hotspot'], //行业研究
  E: ['demandType', 'demandStatus', 'customizedDemand'], //沟通需求
  F: ['demandStatus'], //定制需求
  G: ['industry', 'tradeStatus', 'tradeScale', 'equityChange', 'tradeCurrency'], //设置
  ALL: true //所有菜单
};

function getMenu() {
  return menu_data;
}

function getSettingData() {
  return setting_data;
}
//ttp://mml.qunda.im/customSubscribe/treeList.do
function customSubscribeDate(host, callback) {
  var user = wx.getStorageSync('user') || {};
  wx.request({
    url: host + 'customSubscribe/listInput.do',
    data: {
      'openId': user.openid
    },
    method: 'get',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      callback(res.data)
      customSubscribe = res.data
    }
  })
  //callback(customSubscribe)
}

function getSubscribe() {
  return customSubscribe
}

function updateSettingData(host, data, callback) {
  var user = wx.getStorageSync('user') || {};
  var arr = [],
    i = 0;
  for (var o in data) {
    var objArr = o.split('|');
    arr[i++] = {
      type: objArr[0],
      value: objArr[1]
    };
  }

  wx.request({
    url: host + 'phone/conditionMenu/updateSetting.do',
    data: {
      'openId': user.openid,
      'json': JSON.stringify(arr)
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) {
        callback();
        setting_data = data;
      }
    }
  });

}

function getMapMenu() {
  if (!menuMap.init) {
    initMenuMap();
  }
  return menuMap.idMapper;
}

function generateMenuData(allMenuData, moduleCode) {
  if (moduleCode == 'ALL') {
    return allMenuData;
  }
  var result = [];
  for (var j = 0; j < module_data[moduleCode].length; j++) {
    for (var i = 0; i < allMenuData.length; i++) {
      if (allMenuData[i].type == module_data[moduleCode][j]) {
        result.push(allMenuData[i]);
        break;
      }
    }
  }
  return result;
}
/**moduleCode:A-F，host后台地址 */
function initMap(moduleCode, host, callback) {
  if (all_menu_data.length < 1) {
    var user = wx.getStorageSync('user') || {};
    wx.request({
      url: host + 'phone/conditionMenu/list.do',
      data: {
        'openId': user.openid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        if (res.statusCode == 200) {
          menu_data = generateMenuData(res.data.menu, moduleCode);
          all_menu_data = res.data.menu;
          setting_data = res.data.setting;
          callback();
        }
      }
    });
  } else {
    menu_data = generateMenuData(all_menu_data, moduleCode);
    callback();
  }



}

function initMenuMap() {
  if (all_menu_data && all_menu_data.length > 0) {
    for (var i = 0; i < all_menu_data.length; i++) {
      var levelOne = all_menu_data[i];
      menuMap.idMapper[levelOne.id] = [];
      if (levelOne.items && levelOne.items.length > 0) {
        for (var j = 0; j < levelOne.items.length; j++) {
          var levelTwo = levelOne.items[j];
          menuMap.idMapper[levelOne.id].push(levelTwo.id);
          menuMap.idMapper[levelTwo.id] = [];
          if (levelTwo.items && levelTwo.items.length > 0) {
            for (var k = 0; k < levelTwo.items.length; k++) {
              var levelThree = levelTwo.items[k];
              menuMap.idMapper[levelTwo.id].push(levelThree.id);
              menuMap.idMapper[levelThree.id] = [];
              if (levelThree.items && levelThree.items.length > 0) {
                for (var l = 0; l < levelThree.items.length; l++) {
                  menuMap.idMapper[levelThree.id].push(levelThree.items[l].id);
                }
              }
            }
          }
        }
      }
    }
  }
  menuMap.init = true;
}

module.exports = {
  getMenu: getMenu,
  getMapMenu: getMapMenu,
  initMap: initMap,
  getSettingData: getSettingData,
  updateSettingData: updateSettingData,
  customSubscribeDate: customSubscribeDate,
  getSubscribe: getSubscribe,
  module_data: module_data
}