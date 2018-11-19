var util = require('../../../utils/util.js');
var getWxParse = require('../wxParse/wxParse.js');
  function bottomMenu(conditions,info){
	  //本企业其他资讯
	  if(conditions.isInforMation && conditions.isInforMation=='YES'){
			info.enterpriseInfo = 'bottomMenuToggle';
			info.enterpriseColor = 'colorWhite';
		  //info.enterpriseInfo = util.commons_locale.other_enterprise_infourl+'?queryCondition[relationEnterprise]='+information.relationEnterprise;  
	  }else{
		  info.enterpriseInfo='';
		  info.enterpriseColor = '';
    } 
	  //有无竞争对手
	  if(conditions.isHaveSimpleEnterprise && conditions.isHaveSimpleEnterprise=='YES'){
		  info.enterpriseSimilar = 'bottomMenuToggle'//util.commons_locale.enterprise_detailurl;   
		  info.similarColor = 'colorWhite';
	  }else{
		  info.enterpriseSimilar = '';
		  info.similarColor = '';
	  }
	  //有无行业研究
	  if(conditions.isIndustry && conditions.isIndustry=='YES'){
		  info.industryResearchother = 'bottomMenuToggle'//util.commons_locale.similar_enterpriseurl;  
		  info.industryColor = 'colorWhite'; 
	  }else{
		   info.industryResearchother = '';   
		   info.industryColor = ''; 
	  }
	   //有无企业概括
	  if(conditions.isrelationEnterprise && conditions.isrelationEnterprise=='YES'){
		  info.enterpriseDetail = 'bottomMenuToggle'//util.commons_locale.industry_researchotherurl;   
          info.detailColor = 'colorWhite';
	  }else{
		  info.enterpriseDetail ='';  
		  info.detailColor = ''; 
	  }
	  info.inRequirement = 'bottomMenuToggle';
	  return info;
  }
  function bottomMenuToggle(options){
	  var user = wx.getStorageSync('user') || {};
	  var userMode = wx.getStorageSync('userMode') || {};
	  var type = options.currentTarget.dataset.type;
	  var prerequisite = options.currentTarget.dataset.prerequisite;
    var title = options.currentTarget.dataset.title;
	  let parameter = {};
	  if(type == 'enterpriseInfo'){
		  parameter.url='../../masterlist/information/information?prerequisite=' + prerequisite;
      if (title){
        parameter.url += '&title=' + title
      }
		  util.redirect(parameter);
	  }else if (type == 'enterpriseDetail'){
		  parameter.url='../enterprise-dts/enterprise-dts?modelId='+ prerequisite + '&&verifyFlage=' + userMode.verifyFlage + '&&openid=' + user.openid;
		  util.redirect(parameter);
	  }else if (type == 'enterpriseSimilar'){
		  parameter.url='../similar-company/similar-company?'+ prerequisite;
		  util.redirect(parameter);
	  }else if (type == 'industryResearchother'){
		  parameter.url='../../masterlist/industry-research/industry-research?prerequisite=' + prerequisite;
		  util.redirect(parameter);
	  }else if(type == 'inRequirement'){
		   parameter.url='../../detailspage/newcommun/newcommun?prerequisite=' + prerequisite+'&&demandUrl='+options.demandUrl;
		   util.redirect(parameter);
	  }else if(type == 'research-dts'){
		   parameter.url='../../detailspage/enterprise-research-dts/enterprise-research-dts?modelId=' +prerequisite+'&&verifyFlage='+userMode.verifyFlage+'&&openid=' + user.openid;;
		   util.redirect(parameter);
	  }
  } 
  function wxParse(name, data, that, fatherNode){
    if (data && data != '<p><br></p>'){
      return getWxParse.wxParse(that, data, 'html', name, fatherNode);
    }
    return '';
  }
  /***
   *
   * name
   * list
   * length
   * ****/
  function changeObjectValue(name,list,length){
    if (list && list.length > 0){
        for(var i in list){
          list[i][name] = util.interceptionDate(list[i][name],length);
        }
      }
    return list;
  } 
module.exports = {
  bottomMenu:bottomMenu,
  bottomMenuToggle:bottomMenuToggle,
  changeObjectValue: changeObjectValue,
  wxParse: wxParse
}
