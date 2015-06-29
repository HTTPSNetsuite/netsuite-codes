/*
	*Author: [HTTP]
	*This code snippet is the client script of targetList suitelet
	*Any form of changes on this script and the suitelet script or on the module itselt may or maynot break the 
	*funtionality of this code
	*Date Written: 06/19/2015
*/


function targetListClient(type, name, lineNum) {

   	if(name == 'industry' || name == 'pagi') { 
   		var industry = nlapiGetFieldValue('industry');
   		var inp_name = nlapiGetFieldValue('inp_name');
   		var job_title = nlapiGetFieldValue('job_title');
   		var company_name = nlapiGetFieldValue('company_name');
   		var country = nlapiGetFieldValue('country');
   		var inp_email = nlapiGetFieldValue('inp_email');
   		var list_codes = nlapiGetFieldValue('list_codes');
   		var gss = nlapiGetFieldValue('gss');
   		var ibe = nlapiGetFieldValue('ibe');
   		var dm = nlapiGetFieldValue('dm')
   		var internalid = nlapiGetFieldValue('hidden_field');
         var pagi = nlapiGetFieldValue('pagi');
   		window.location = nlapiResolveURL('SUITELET', 'customscript_target_list', 'customdeploy1') + "&internalid=" + internalid + "&industry=" + industry +"&inp_name=" + inp_name +"&job_title=" + job_title +"&company_name=" + company_name +"&country=" + country +"&inp_email=" + inp_email +"&list_codes=" + list_codes +"&gss=" + gss +"&ibe=" + ibe +"&dm="+ dm + "&pagi=" + pagi;
  	}
}