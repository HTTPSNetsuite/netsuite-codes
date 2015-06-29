/*
	*Author: [HTTP]
	*This code snippet will auto edit the PMO that has scheduled on the set time
*/

function autoPopulatePMO() {
	var qry = nlapiSearchRecord(null, 'customsearch180', null, null);
	if(qry == null) return;
	for(var counter = 0; counter < qry.length; counter++) {
		var loadRec = nlapiLoadRecord('customrecord_preventive_maintenance_plan', qry[counter].getId());
		var cycleUnit = parseInt(loadRec.getFieldValue('custrecord_pmp_cycle_unit'));
		var unit = loadRec.getFieldValue('custrecord165');
		var fixedVariable = loadRec.getFieldValue('custrecord_pmp_fixed_variable');
		var start_sked = loadRec.getFieldValue('custrecord_pmp_start_sched_date');
		var lastInspection = loadRec.getFieldValue('custrecord_last_inspection_date');
		var advanceOrder = loadRec.getFieldValue('custrecord_pmp_scheduling_period');
		var advanceCycle = loadRec.getFieldValue('custrecord235');
		var lastTrigger = loadRec.getFieldValue('custrecord234');
		
		if(fixedVariable == 1) {
			//sets the value of Last Trigger Date of WO (Last servicing date - advanced order)
			var lastTriggerDate = addDays(advanceOrder, reverseDate(lastInspection), advanceCycle, 'subtract');
			nlapiSetFieldValue('custrecord234', lastTriggerDate);

			//sets the value of Last Servicing Date
			//but just create first a search that will get the last created date of this record
			var lastCreatedWOFilter = [ new nlobjSearchFilter('created')];

			nlapiSetFieldValue('custrecord_last_inspection_date', start_sked);
			nlapiSetFieldValue('custrecord236', addDays(advanceOrder, reverseDate(nlapiGetFieldValue('custrecord_last_inspection_date')), advanceCycle, 'subtract'));
			nlapiSetFieldValue('custrecord_next_inspection_date', addDays(advanceOrder, reverseDate(nlapiGetFieldValue('custrecord236')), advanceCycle, 'subtract'));
		} else if(fixedVariable == 2) {
			nlapiSetFieldValue('custrecord_last_inspection_date', start_sked);
			nlapiSetFieldValue('custrecord236', addDays(advanceOrder, reverseDate(nlapiGetFieldValue('custrecord_last_inspection_date')), advanceCycle, 'add'));
		}
	}
}

function reverseDate(thisDate) {
	var reverseDate = thisDate.split('/'); //date format of netsuite starts from day but javascript was set to month so kinda reverse the day and month
	return reverseDate[1] + '/' + reverseDate[0] + '/' + reverseDate[2];
}



//function to set current date when the cycle and scheduling period will be added.
function addDays(daysToAdd, passedDate, unit, action) {
	var newDate = new Date(passedDate);
	if(action === 'add') {
		if(unit == 1) { //means the scheduled date is per DAY
		newDate.setDate(newDate.getDate() + daysToAdd);
		} else if(unit == 2) { //means per Month
			newDate.setMonth((newDate.getMonth() + daysToAdd));
		} else if(unit == 3) { //means per year
			newDate.setFullYear(newDate.getFullYear() + daysToAdd);
		} else if(unit == 4) { //means per Month
			newDate.setDate(newDate.getDate() + (daysToAdd*7));
		}
	} else {
		if(unit == 1) { //means the scheduled date is per DAY
		newDate.setDate(newDate.getDate() - daysToAdd);
		} else if(unit == 2) { //means per Month
			newDate.setMonth((newDate.getMonth() - daysToAdd));
		} else if(unit == 3) { //means per year
			newDate.setFullYear(newDate.getFullYear() - daysToAdd);
		} else if(unit == 4) { //means per Month
			newDate.setDate(newDate.getDate() - (daysToAdd*7));
		}
	}
	return newDate.getDate() + '/' + (Number(newDate.getMonth())+1) + '/' + newDate.getFullYear();
}