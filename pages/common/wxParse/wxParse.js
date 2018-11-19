
/**
 * utils函数引入
 **/
import showdown from './showdown.js';
import HtmlToJson from './html2json.js';
const picUrl = require('../../../config').picUrl;
/**
 * 配置及公有属性
 **/
var realWindowWidth = 0;
var realWindowHeight = 0;
wx.getSystemInfo({
  success: function (res) {
    realWindowWidth = res.windowWidth
    realWindowHeight = res.windowHeight
  }
})
/**
 * 主函数入口区
 **/
 
function wxParse(obj, data, type, bindName, fatherNode,imagePadding){
  let transData={},bindData={};
  if (type == 'html') {
    transData = HtmlToJson.html2json(data, bindName, fatherNode);
	
  } else if (type == 'md' || type == 'markdown') {
    var converter = new showdown.Converter();
    var html = converter.makeHtml(data);
    transData = HtmlToJson.html2json(html, bindName, fatherNode);
	
  }
  transData.view = {};
  transData.view.imagePadding = 0;
  if(typeof(imagePadding) != 'undefined'){
    transData.view.imagePadding = imagePadding
  }
  
	  
	 //图片视觉宽高计算函数区 
   obj.wxParseImgLoad = function wxParseImgLoad(e) {
		var tagFrom = e.target.dataset.from;
		var idx = e.target.dataset.idx;
		if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
			calMoreImageInfo(e, idx, obj, tagFrom)
		} 
	}
  //图片加载成功回调
   obj.wxParseImgTap = function wxParseImgTap(e) {
	  var nowImgUrl = e.target.dataset.src;
	  var tagFrom = e.target.dataset.from;
	  if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
		wx.previewImage({
		  current: nowImgUrl, // 当前显示图片的http链接
		  urls: obj.data[tagFrom].imageUrls, // 需要预览的图片http链接列表
		})
	  }
	};
  //图片加载失败回调
   obj.wxParseImgError = function wxParseImgError(e){
     //debugger
     var tagFrom = e.target.dataset.from;
     var idx = e.target.dataset.idx;
     if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
       errorImages(e, idx, obj, tagFrom)
     } 
   };
	bindData[bindName] = transData;
	obj.setData(bindData)
   return transData;
 }
 // 假循环替换图片
 function errorImages(e, idx, that, bindName) {
   var temData = that.data[bindName];
   var fatherNode = temData.fatherNode;
   if (!temData || temData.images.length == 0) {
     return;
   }
   var nodes = temData.images;
   var index = nodes[idx].index
   var key = `${bindName}`
   if (fatherNode){
     key = fatherNode + '.' + key
   }
   for (var i of index.split('.')) key += `.nodes[${i}]`
    var attr = key + '.attr'
    var keySrc = attr +'.src'
    var styleStr = key +'.styleStr';
    that.setData({
      [styleStr]: "width: 80px; height: 80px;",
      [keySrc]: picUrl +'errorImg.png'
    })
 }

// 假循环获取计算图片视觉最佳宽高
function calMoreImageInfo(e, idx, that, bindName) {
  var temData = that.data[bindName];
  if (!temData || temData.images.length == 0) {
    return;
  }
  var temImages = temData.images;
  //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
  var recal = wxAutoImageCal(e.detail.width, e.detail.height,that,bindName); 
  // temImages[idx].width = recal.imageWidth;
  // temImages[idx].height = recal.imageheight; 
  // temData.images = temImages;
  // var bindData = {};
  // bindData[bindName] = temData;
  // that.setData(bindData);
  var index = temImages[idx].index
  var key = `${bindName}`
  for (var i of index.split('.')) key+=`.nodes[${i}]`
  var keyW = key + '.width'
  var keyH = key + '.height'
  that.setData({
    [keyW]: recal.imageWidth,
    [keyH]: recal.imageheight,
  })
}

// 计算视觉优先的图片宽高
function wxAutoImageCal(originalWidth, originalHeight,that,bindName) {
  //获取图片的原始长宽
  var windowWidth = 0, windowHeight = 0;
  var autoWidth = 0, autoHeight = 0;
  var results = {};
  var padding = that.data[bindName].view.imagePadding;
  windowWidth = realWindowWidth-2*padding;
  windowHeight = realWindowHeight;
  //判断按照那种方式进行缩放
  if (originalWidth > windowWidth) {//在图片width大于手机屏幕width时候
    autoWidth = windowWidth;
    autoHeight = (autoWidth * originalHeight) / originalWidth;
    results.imageWidth = autoWidth;
    results.imageheight = autoHeight;
  } else {//否则展示原来的数据
    results.imageWidth = originalWidth;
    results.imageheight = originalHeight;
  }
  return results;
}

function wxParseTemArray(temArrayName,bindNameReg,total,that){
  var array = [];
  var temData = that.data;
  var obj = null;
  for(var i = 0; i < total; i++){
    var simArr = temData[bindNameReg+i].nodes;
    array.push(simArr);
  }

  temArrayName = temArrayName || 'wxParseTemArray';
  obj = JSON.parse('{"'+ temArrayName +'":""}');
  obj[temArrayName] = array;
  that.setData(obj);
}

/**
 * 配置emojis
 * 
 */

function emojisInit(reg='',baseSrc="/wxParse/emojis/",emojis){
   HtmlToJson.emojisInit(reg,baseSrc,emojis);
}

module.exports = {
  wxParse: wxParse,
  wxParseTemArray:wxParseTemArray,
  emojisInit:emojisInit
}


