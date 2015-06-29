/*
	*Author: [HTTP]
	*This code snipper will create inventory adjustment automatocally upon saving the inventory upload custom record

	*NOTE: The weakness of the script will trigger if the user will edit and/or the user will create again the same inventory upload
*/




function createInventoryAdjustment(req, res) {
	var recordId = nlapiGetRecordId();
	var loadRec = nlapiLoadRecord('customrecord_inventory_upload', recordId);


	//for better performance, we will make an array of items on the brand search result
	var arrayOfItems = [];
	//loop through each search record
	for(var counter = 1; counter <= loadRec.getLineItemCount('recmachcustrecord_upload'); counter++) {
		if(inArray(loadRec.getLineItemValue('recmachcustrecord_upload', 'custrecord_item_code_details', counter), arrayOfItems) === false) {
			arrayOfItems.push(loadRec.getLineItemValue('recmachcustrecord_upload', 'custrecord_item_code_details', counter));
		}
	}


	//now that we have all the record grouped by items, then will search for record that has this item
	for(var i = 0; i < arrayOfItems.length; i++) {
		//loop through each items
		var f = [new nlobjSearchFilter('custrecord_item_brand_upload', null, 'is', loadRec.getFieldValue('custrecord_item_brand_list')), 
				 new nlobjSearchFilter('custrecord_item_code_details', null, 'is', arrayOfItems[i])];
		var searchRecord = nlapiSearchRecord(null, 'customsearch_customitem', f, null);
		if(searchRecord == null) continue; //validate if the search really has a record
		//create inventory adjustment starting poing
		var create_record = nlapiCreateRecord('inventoryadjustment');
		create_record.setFieldValue('class', loadRec.getFieldValue('custrecord_item_brand_list'));
		create_record.setFieldValue('account', 53);
		for(var countItem = 0; countItem < searchRecord.length; countItem++) {
			create_record.selectNewLineItem('inventory');
			create_record.setCurrentLineItemValue('inventory', 'item', searchRecord[countItem].getValue('custrecord_item_code_details'));
			create_record.setCurrentLineItemValue('inventory', 'location', searchRecord[countItem].getValue('custrecord_upload_location'));
			create_record.setCurrentLineItemValue('inventory', 'adjustqtyby', searchRecord[countItem].getValue('custrecord_quantity_to_adjust'));
			create_record.setCurrentLineItemValue('inventory', 'unitcost', nlapiLookupField('lotnumberedinventoryitem', searchRecord[countItem].getValue('custrecord_item_code_details'), 'cost'));

			//this will create subrecord
			var subrecord = create_record.createCurrentLineItemSubrecord('inventory', 'inventorydetail')
			subrecord.selectNewLineItem('inventoryassignment');
			subrecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', searchRecord[countItem].getValue('custrecord_item_bin'));
			subrecord.setCurrentLineItemValue('inventoryassignment', 'expirationdate', searchRecord[countItem].getValue('custrecord_expiration_date'));
			subrecord.setCurrentLineItemValue('inventoryassignment', 'receiptinventorynumber', searchRecord[countItem].getValue('custrecord_lot_number'));
			subrecord.setCurrentLineItemValue('inventoryassignment', 'quantity', searchRecord[countItem].getValue('custrecord_quantity_to_adjust'));
			subrecord.commitLineItem('inventoryassignment');
			//commit Inventory Detail subrecord to parent record
			subrecord.commit();

			//commit line Item inventory
			create_record.commitLineItem('inventory');
			nlapiDeleteRecord('customrecord_item_details_for_upload', searchRecord[countItem]['id']);
		}

		nlapiSubmitRecord(create_record); //submit entire record
	}

	nlapiDeleteRecord('customrecord_inventory_upload', recordId);
}




//write a custom function to check if the element is on the array
function inArray(needle, haystack) {
	var validate = false;
	for(count = 0; count < haystack.length; count++) {
		if(needle === haystack[count]) {
			validate = true;
			break;
		}
	}

	return validate;
}
