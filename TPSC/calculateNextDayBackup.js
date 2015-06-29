/*
	*Author: [HTTP]
	*This code snippet is for the Plan Cycle opportunity
*/


function calculateNextDay(type, name, lineNumber) {
	if(name == 'custrecord_pmp_cycle_unit' || name == 'custrecord165' || name == 'custrecord_pmp_start_sched_date' || name == 'custrecord_last_inspection_date' || name == 'custrecord_pmp_scheduling_period' || name == 'custrecord235' || name == 'custrecord_pmp_fixed_variable') {
		//get all the prerequisite fields
		var cycleUnit = parseInt(nlapiGetFieldValue('custrecord_pmp_cycle_unit'));
		var unit = nlapiGetFieldValue('custrecord165');
		var start_sked = nlapiGetFieldValue('custrecord_pmp_start_sched_date');
		var lastInspection = nlapiGetFieldValue('custrecord_last_inspection_date');
		var advanceOrder = nlapiGetFieldValue('custrecord_pmp_scheduling_period');
		var advanceCycle = nlapiGetFieldValue('custrecord235');
		var lastTrigger = nlapiGetFieldValue('custrecord234');
		var fixedVariable = nlapiGetFieldValue('custrecord_pmp_fixed_variable');
		var arrayOfVariables = [cycleUnit, unit, start_sked];
		if(validateEmptyVariables(arrayOfVariables) === true) return;

		//checks if this is a new record
		if(nlapiGetRecordId() == null || nlapiGetRecordId() == '') {
			//check if what date is greater start date or last trigger date
			var last = '';
			if(lastInspection != '') {
				var last = new Date(reverseDate(lastInspection));
				last = last.getTime();
			}				
			var start = new Date(reverseDate(start_sked));
			start = start.getTime();
			if(start > last) {
				nlapiSetFieldValue('custrecord236', addDays(0, reverseDate(start_sked), unit, 'add'));
			} else {
				nlapiSetFieldValue('custrecord236', addDays(cycleUnit, reverseDate(lastInspection), unit, 'add'));
			}
			
			nlapiSetFieldValue('custrecord_next_inspection_date', addDays(advanceOrder, reverseDate(nlapiGetFieldValue('custrecord236')), advanceCycle, 'subtract'));
		}
	}
}

function onThisPageInit() {
	if(nlapiGetRecordId() != '') {
		//disable all cycle field
		nlapiDisableField('custrecord_pmp_cycle_unit', true);
		nlapiDisableField('custrecord165', true);
		nlapiDisableField('custrecord_pmp_start_sched_date', true);
		nlapiDisableField('custrecord_last_inspection_date', true);
		nlapiDisableField('custrecord_pmp_scheduling_period', true);
		nlapiDisableField('custrecord235', true);
		nlapiDisableField('custrecord_pmp_fixed_variable', true);
		nlapiDisableField('custrecord234', true);
	}

}


//function to validate if there are empty variables
function validateEmptyVariables(arrayOfVariables) {
	var val = false;
	for(var x = 0; x < arrayOfVariables.length; x++) {
		if(arrayOfVariables[x] == '') {
			val = true;
		}
	}
	return val;
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