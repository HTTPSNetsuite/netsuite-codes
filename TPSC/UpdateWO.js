/*
	*Author: [HTTP]
	*This code snippet will update the plan cycle in PMP
*/

function updateWo(type, form) {
	if(type == 'edit' && nlapiGetFieldValue('custrecord_document_status') == 4 && nlapiGetFieldValue('custrecord212') == 6 && nlapiGetFieldValue('custrecord_end_date') != '') {
		var loadRec = nlapiLoadRecord('customrecord_preventive_maintenance_plan', nlapiGetFieldValue('custrecord155'));
		var cycleUnit = parseInt(loadRec.getFieldValue('custrecord_pmp_cycle_unit'));
		var unit = loadRec.getFieldValue('custrecord165');
		var start_sked = loadRec.getFieldValue('custrecord_pmp_start_sched_date');
		var lastInspection = loadRec.getFieldValue('custrecord_last_inspection_date');
		var advanceOrder = loadRec.getFieldValue('custrecord_pmp_scheduling_period');
		var advanceCycle = loadRec.getFieldValue('custrecord235');
		var lastTrigger = loadRec.getFieldValue('custrecord234');
		var fixedVariable = loadRec.getFieldValue('custrecord_pmp_fixed_variable');
		var nextCycleDate = loadRec.getFieldValue('custrecord236');
		var nextTriggerDate = loadRec.getFieldValue('custrecord_next_inspection_date');

		if(fixedVariable == 2) {//set value of last next trigger date
			//sets value of close date
			loadRec.setFieldValue('custrecord241', nlapiGetFieldValue('custrecord_end_date'));
			//set value of last next trigger date
			loadRec.setFieldValue('custrecord234', nextTriggerDate);
			//sets value of next last servicing date
			loadRec.setFieldValue('custrecord_last_inspection_date', nextCycleDate);
			loadRec.setFieldValue('custrecord236', addDays(cycleUnit, reverseDate(loadRec.getFieldValue('custrecord241')), unit, 'add'));
				//sets the value of next trigger date.
			loadRec.setFieldValue('custrecord_next_inspection_date', addDays(advanceOrder, reverseDate(loadRec.getFieldValue('custrecord236')), advanceCycle, 'subtract'));
			nlapiSubmitRecord(loadRec);
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

