/*
	*Author: [HTTP]
	*This code snippet is just a work around on the adding of list codes in the save search.
	*This may or may not break the current functionality of the code... 
*/


function scheduledAddListCode() {
	var loadSearch = nlapiLoadSearch(null, 'customsearch1694', null, null);
	var runSearch = loadSearch.runSearch();
	var subset = runSearch.getResults(0, 1000);
	if(subset != null) {
		for(var i = 0; i < subset.length; i++) {
			var loadRec = nlapiLoadRecord('contact', subset[i].getId());
			var listCodes = loadRec.getFieldValue('custentity32');
			var listCodesToAdd = loadRec.getFieldValue('custentity4');

			var tempListCodes = [];
			if(listCodes != null) {
				listCodes = listCodes.split(',');
				for(var x in listCodes) {
					tempListCodes.push(listCodes[x]);
				}
			}

			//validate if the listcode in hidden field is already in the multiselect field
			if(validateListCode(listCodesToAdd, listCodes) == false) {
				if(listCodesToAdd != null) {
					tempListCodes.push(listCodesToAdd);
					loadRec.setFieldValues('custentity4', tempListCodes);
					loadRec.setFieldValue('custentity32', null);
					nlapiSubmitRecord(loadRec);
				}	
			}				
		}
	}
	
	
}


function validateListCode(listCode, arrayOfListCodes) {
	var val = false;
	for(var y = 0; y < arrayOfListCodes.length; y++) {
		if(listCode == arrayOfListCodes[y]) {
			val = true;
			break;
		}
	}
	return val;
}
