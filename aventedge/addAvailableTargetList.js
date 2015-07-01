/*
	*Author: [HTTP]
	*This code snippet will auto fill the target list of opportunity
*/


function addAvailableTargetList(type, form) {
	//search Save Search for available record
	var thisId = nlapiGetRecordId();

	//create search
	var qryFilter = [new nlobjSearchFilter('custrecord_tlc_opportunity', null, 'is', thisId)];
	var qryFields = [new nlobjSearchColumn('custrecord_tlc_target_list'), 
					 new nlobjSearchColumn('custrecord_tlc_customer')];

	var qry =  nlapiCreateSearch('customrecord_ms_target_list_customers', qryFilter, qryFields);
	var runQry = qry.runSearch();
	var result = runQry.getResults(0, 1);
	if(result != null) {
		//just get the first record in the result
		nlapiSetFieldValue('custbody_ms_created_from_target_list', result[0].getValue('custrecord_tlc_target_list'));
		nlapiSetFieldValue('custbody_ms_tlc_ref', result[0].getValue('custrecord_tlc_customer'));
	}

}