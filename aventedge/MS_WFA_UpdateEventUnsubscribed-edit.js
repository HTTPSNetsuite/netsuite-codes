var PARM_CUSTOMER = nlapiGetContext().getSetting('SCRIPT', 'custscript_wfa_ueu_cust');

function action_UpdateEventUnsubscribed() {
	
	if (PARM_CUSTOMER) {
		var stRecType = nlapiLookupField('entity', PARM_CUSTOMER, 'recordType');
		var recCust = nlapiLoadRecord(stRecType, PARM_CUSTOMER);
		
		var arrResults = M$.search({
			type: 'customrecord_contact_opt_out',
			filters: [new nlobjSearchFilter('isinactive', 'custrecord_opt_out_event', 'is', 'F'), 
					  new nlobjSearchFilter('custrecord_contact', null, 'is', PARM_CUSTOMER)],
			columns: [new nlobjSearchColumn('custrecord_opt_out_event')]
		});
		var objTempEvents = {};
		var arrEvents = [];
		var arrNewEventsValues = [];
		
		for (var idx=0; idx < arrResults.length; idx++) {
			var stClassId = arrResults[idx].getValue('custrecord_opt_out_event');
			if (stClassId) {
				objTempEvents[arrResults[idx].getValue('custrecord_opt_out_event')] = true;
			}
		}
		
		for (var stEventId in objTempEvents) {
			arrEvents.push(stEventId);
		}
		
		/*
		var arrClassFilters = [];
		arrClassFilters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
		arrClassFilters.push(new nlobjSearchFilter('internalid', null, 'anyof', arrEvents));
		
		var arrClassResults = nlapiSearchRecord('classification', null, arrClassFilters);
		
		if (arrClassResults) {
			for (var idx=0; idx < arrClassResults.length; idx++) {
				arrNewEventsValues.push(arrClassResults[idx].getId());
			}
		}
		
		if (arrNewEventsValues.length > 0) {
			nlapiSubmitField(stRecType, PARM_CUSTOMER, 'custentity24', arrNewEventsValues);
		} else {
			nlapiSubmitField(stRecType, PARM_CUSTOMER, 'custentity24', null);
		}
		*/
		if (arrEvents.length > 0) {
			nlapiSubmitField(stRecType, PARM_CUSTOMER, 'custentity24', arrEvents);
		} else {
			nlapiSubmitField(stRecType, PARM_CUSTOMER, 'custentity24', null);
		}

	}
}