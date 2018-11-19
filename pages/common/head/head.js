
const host = require('../../../config').host;
module.exports = {
  init: function (obj) {
    obj.navigateBack = function () {
      wx.navigateBack()
    }
    obj.homeBind = function() {
      wx.navigateTo({
        url: '../../../../pages/homepage/homepage',
      })
    }
  }
}
