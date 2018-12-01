
const Towxml = require('towxml/main');
App({  
  onLaunch: function () {
	},
	towxml:new Towxml(),//创建towxml对象，供小程序页面使用
  isTheAccountBinding:function(obj){
    return ;
	 wx.request({
		 url:host+"",
		 data: {},
		 method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
		 success: function (res) {
			var obj = {};
			obj.openid = res.data.openid;
			obj.expires_in = Date.now() + res.data.expires_in;
    
			wx.setStorageSync('user', obj);//存储openid  
		  }
	 })
  }
})