/**
 * 小程序配置文件
 */
// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la



<<<<<<< HEAD
//  var host = "http://192.168.1.97:8080/merger-weixin-webapp/"
  //var host = "http://192.168.1.250:8080/merger-weixin-webapp/"
  //var host = "http://182.168.1.36:9999/merger-weixin-webapp/"
 var host = "https://www.merger-link.com/merger-weixin-webapp/";

  var watermarkurl = "https://www.merger-link.com/merger-weixin-webapp/custom/watermark.do?id=";
//  var watermarkurl = "http://192.168.1.97:8080/merger-weixin-webapp/custom/watermark.do?id="
=======
var host = "http://192.168.1.97:8080/merger-weixin-webapp/"
  //var host = "http://192.168.1.250:8080/merger-weixin-webapp/"
  //var host = "http://182.168.1.36:9999/merger-weixin-webapp/"
  //var host = "https://www.merger-link.com/merger-weixin-webapp/";

  // var watermarkurl = "https://www.merger-link.com/merger-weixin-webapp/custom/watermark.do?id=";
var watermarkurl = "http://192.168.1.97:8080/merger-weixin-webapp/custom/watermark.do?id="
>>>>>>> e76c6facb39f39ecb656e80e2502fdd67bf19b88

var config = {
   watermarkurl,
  host,
  // 用code换取openId
  openIdUrl: `https://api.weixin.qq.com/sns/jscode2session`, /// 
  //服务器图片路径  
  picUrl: host +'phone/wximages/'
};
module.exports = config
