var home_item = require('../pages/common/switchhomepage/home_item.js');
var config = require('../config.js');
var allMenu = require('../utils/allMenu.js');
var util = require('../utils/util.js');
var menu = require('../pages/common/menu/menu.js');
var user = wx.getStorageSync('user') || {};
module.exports = {
  inintJs: function (obj, callback) {
    obj.homeItem = function () {
      return home_item;
    }
    obj.config = function () {
      return config;
    }
    obj.allMenu = function () {
      return allMenu;
    }
    obj.util = function () {
      return util;
    }
    obj.menu = function(){
      return menu;
    }
    obj.user = function(){
      return user;
    }
    callback(obj);
  }
}

