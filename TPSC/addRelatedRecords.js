function addRelatedRecords(req, res) {
	if(nlapiGetRecordId() === '' || nlapiGetRecordId() === null) return; //validates if the current record really exist

	var famTab = form.addTab('custpage_fam', 'FAM');//creates a tab and append on the existing form on the page
	 
	var listOfRecords = form.addSubList('custpage_sig_req_sublist',	'list', 'List of related records','custpage_fam'); //create sublist inside the newly created tab

	listOfRecords.addField('custpage_req_id', 'text', 'ID');
	listOfRecords.addField('custpage_req_name', 'text', 'Name');

	//search on the custom record (Maintenance Work Order) if the existing record associated on this FAM
	var ret = [new nlobjSearchColumn('custrecord_asset'), 
			new nlobjSearchColumn('name')];
	var qry = nlapiSearchRecord('customrecord300', null, null, ret);
	if(qry === null) return;
	var count = 1;
	for(var counter = 0; counter < qry.length; counter++) {
		//buti na lang pwede magreturn ng custom field so....
		if(qry[counter].getValue('custrecord_asset') !== nlapiGetRecordId()) continue;
		listOfRecords.setLineItemValue('custpage_req_id', count, qry[counter]['id']);
		listOfRecords.setLineItemValue('custpage_req_name', count, qry[counter].getValue('name'));
		count++;
	}
}