/*
	*Author: [HTTP]
	*This code snippet is just a work around on the adding of list codes in the save search.
	*This may or may not break the current functionality of the code... 
*/


function addListCode() {
	if(type == 'edit') {
		var loadRec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		var listCodes = loadRec.getFieldValue('custentity4');
		var listCodesHidden = loadRec.getFieldValue('custentity32');
		var tempListCodes = [];
		if(listCodes != null) {
			for(var x in listCodes) {
				tempListCodes.push(listCodes[x]);
			}
		}

		if(listCodesHidden != null) {
			tempListCodes.push(listCodesHidden);
			loadRec.setFieldValues('custentity4', tempListCodes);
			loadRec.setFieldValue('custentity32', null);
			nlapiSubmitRecord(loadRec);
		}		
	}
}

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}