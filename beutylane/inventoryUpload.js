/*
	*Author: [HTTP]
	*This code snippet will automatically create inventory adjustment per Item based on the selected brand 
	*Date Written: 06/16/2015

	*NOTE: The weakness of the script will trigger if the user will edit and/or the user will create again the same inventory upload
*/

function inventoryUpload(type, name, lineNumber) {
	if(name != 'custrecord_item_brand_list') return; 

	var brand = nlapiGetFieldValue('custrecord_item_brand_list');	

	//delete all the existing line item on the screen
	//count the current line item
	var lineCount = nlapiGetLineItemCount('recmachcustrecord_upload');
	if(lineCount > 0) {
		for(var lineCounter = 1; lineCounter <= lineCount; lineCounter++) {
			nlapiRemoveLineItem('recmachcustrecord_upload', lineCounter);
		}
	}

	//hindi ko alam kung bakit pero bakit ayaw nia gumana diretsa sa customer record.. 
	//pag nagsearch ng wala dapat expect record.. may nilalabas... weird
	//gawin natin via save search
	//get all records with this brand in inventory Item Details for Upload
	var f = [new nlobjSearchFilter('custrecord_item_brand_upload', null, 'is', brand)];
	var searchRecord = nlapiSearchRecord(null, 'customsearch_customitem', f, null);
	if(searchRecord == null) return; //validate if the search really has a record	

	for(var counter = 0; counter < searchRecord.length; counter++) {
		nlapiSelectNewLineItem('recmachcustrecord_upload');
		nlapiSetCurrentLineItemValue('recmachcustrecord_upload', 'custrecord_quantity_to_adjust', searchRecord[counter].getValue('custrecord_quantity_to_adjust'));
		nlapiSetCurrentLineItemValue('recmachcustrecord_upload', 'custrecord_item_code_details', searchRecord[counter].getValue('custrecord_item_code_details'));
		nlapiSetCurrentLineItemValue('recmachcustrecord_upload', 'custrecord_item_brand_upload', searchRecord[counter].getValue('custrecord_item_brand_upload'));
		nlapiSetCurrentLineItemValue('recmachcustrecord_upload', 'custrecord_lot_number', searchRecord[counter].getValue('custrecord_lot_number'));
		nlapiSetCurrentLineItemValue('recmachcustrecord_upload', 'custrecord_item_bin', searchRecord[counter].getValue('custrecord_item_bin'));
		nlapiSetCurrentLineItemValue('recmachcustrecord_upload', 'custrecord_expiration_date', searchRecord[counter].getValue('custrecord_expiration_date'));
		nlapiSetCurrentLineItemValue('recmachcustrecord_upload', 'custrecord_upload_location', searchRecord[counter].getValue('custrecord_upload_location'));
		nlapiCommitLineItem('recmachcustrecord_upload');
	}
}
