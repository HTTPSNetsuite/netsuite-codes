/*
	*Author: [HTTP]
	*This code snipper will auto delete the uploaded record and will save a new to avoid replication.


	*NOTE: The weakness of the script will trigger if the user will edit and/or the user will create again the same inventory upload
*/

function deleteExistingInventoryUpload() {
	var brand = nlapiGetFieldValue('custrecord_item_brand_list');
	if(brand == null || brand == '') return;
	var f = [new nlobjSearchFilter('custrecord_item_brand_upload', null, 'is', brand)];
	var searchRecord = nlapiSearchRecord(null, 'customsearch_customitem', f, null);
	if(searchRecord == null) return; //validate if the search really has a record

	for(var counter = 0; counter < searchRecord.length; counter++) {
		nlapiDeleteRecord('customrecord_item_details_for_upload', searchRecord[counter]['id']);
	}
}