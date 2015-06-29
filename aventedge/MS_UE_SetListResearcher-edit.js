

function beforeSubmit_setListResearcher(stEvent) {
	
	var arrFields = [
        'firstname',
        'lastname',
        'company',
        'title',
        'billaddr1',
        'phone',
        'mobilephone',
        'custentity1',
        'custentity2'
    ];

	M$.logDebug('beforeSubmit_setListResearcher', 'stEvent: ' + stEvent);
	
	var stUserID = nlapiGetContext().getUser();
	if (M$.parseFloat(stUserID) <= 0) return;
	
	if (stEvent == 'create') {
		nlapiSetFieldValue('custentity_list_researcher', stUserID);
	}
	
	if (stEvent == 'edit' || stEvent == 'xedit') {
		var recOld = nlapiGetOldRecord();
		var recNew = nlapiGetNewRecord();
		
		for (var idx=0; idx < arrFields.length; idx++) {
			var stOld = recOld.getFieldValue(arrFields[idx]);
			var stNew = recNew.getFieldValue(arrFields[idx]);
			
			if (!stOld) {
				stOld = null;
			}

			if (!stNew) {
				stNew = null;
			}

			if (stOld != stNew) {
				M$.logDebug('beforeSubmit_setListResearcher', stEvent + ': ' + arrFields[idx] + ' ' + stOld + ' != ' + stNew);
				nlapiSetFieldValue('custentity_list_researcher', stUserID);
				break;
			}
		}
	}
	/*
	if (stEvent == 'xedit') {
		var recNew = nlapiGetNewRecord();
		
		var arrModifiedFields = recNew.getAllFields();
		var bMatched = false;
		
		M$.logDebug('beforeSubmit_setListResearcher', 'arrModifiedFields: ' + JSON.stringify(arrModifiedFields));
		
		for (var iA=0; iA < arrModifiedFields.length && !bMatched; iA++) {
			for (var iB=0; iB < arrFields.length; iB++) {
				if (arrFields[iB] == arrModifiedFields[iA]) {
					M$.logDebug('beforeSubmit_setListResearcher', 'xedit: ' + arrFields[iB]);
					nlapiSetFieldValue('custentity_list_researcher', stUserID);
					bMatched = true;
					break;
				}
			}
		}
		
	}
	*/
	
}