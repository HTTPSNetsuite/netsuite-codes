
var PARM_LIST_CODE = 'custscript_ms_alc_list_code';

function massUpdatdeweewe_addListCode(record_type, record_id) {
	try {
		M$.logDebug('massUpdate_addListCode', 'record_type: ' + record_type + ', record_id: ' + record_id);

		var stListCodeToProcess = nlapiGetContext().getSetting('SCRIPT', PARM_LIST_CODE);
		
		var arrListCodes = [];
		var recEntity = nlapiLoadRecord(record_type, record_id);
		var arrCurListCodes = recEntity.getFieldValues('custentity4');
		
		if (arrCurListCodes && arrCurListCodes.length > 0) {
			var arrFilters = [];
			arrFilters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
			arrFilters.push(new nlobjSearchFilter('internalid', null, 'anyof', arrCurListCodes));
			
			var arrColumns = [];
			arrColumns.push(new nlobjSearchColumn('internalid'));
			
			var arrResults = M$.search({
				type: 'customlist6',
				filters: arrFilters,
				columns: arrColumns
			});
			
			for (var idx=0; idx < arrResults.length; idx++) {
				var stListCodeId = arrResults[idx].getId();
				if (stListCodeId != stListCodeToProcess) {
					arrListCodes.push(stListCodeId);
				}
			}
		}
		
		arrListCodes.push(stListCodeToProcess);
		
		nlapiSubmitField(record_type, record_id, 'custentity4', arrListCodes);
		
	} catch (ex) {
		M$.logError('massUpdate_addListCode', M$.parseError(ex));
	}
}