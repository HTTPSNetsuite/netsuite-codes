//for better performance, we will make an array of items on the brand search result
	var arrayOfItems = [];
	//loop through each search record
	for(var counter = 0; counter < searchRecord.length; counter++) {
		if(inArray(searchRecord[counter].getValue('') === false)) {
			arrayOfItems.push(searchRecord[counter]);
		}
	}


	//now that we have all the record grouped by items, then will search for record that has this item
	for(var i = 0; i < arrayOfItems.length; i++) {
		//formulate a search
		var itemFilter = [new nlobjSearchFilter('custrecord_item_code_details', null, 'is', arrayOfItems[i])];
		var itemColumn = [new nlobjSearchColumn('custrecord_lot_number'), 
						  new nlobjSearchColumn('custrecord_item_bin'), 
						  new nlobjSearchColumn('custrecord_expiration_date'),
						  new nlobjSearchColumn('custrecord_quantity_to_adjust'),
						  new nlobjSearchColumn('custrecord_upload'), 
		var searchItem = nlapiSearchRecord('customsearch_customitem', null, itemFilter, itemColumn);
		
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

