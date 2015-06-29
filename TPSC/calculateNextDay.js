function calculateNextDay(type, name, lineNumber) {
	if(name == 'custrecord_last_inspection_date' || name == 'custrecord_pmp_cycle_unit' || name == 'custrecord165' || name == 'custrecord_pmp_scheduling_period') {
		//get all the prerequisite fields
		var cycleUnit = parseInt(nlapiGetFieldValue('custrecord_pmp_cycle_unit'));
		var unit = nlapiGetFieldValue('custrecord165');
		var speriod = (isNaN(parseInt(nlapiGetFieldValue('custrecord_pmp_scheduling_period')))) ? 0: parseInt(nlapiGetFieldValue('custrecord_pmp_scheduling_period'));
		var fixedVariable = nlapiGetFieldValue('custrecord_pmp_fixed_variable');
		var lastInspection = nlapiGetFieldValue('custrecord_last_inspection_date');
		if(unit == '' || cycleUnit == '' || lastInspection == '') return;
		var reverseDate = lastInspection.split('/'); //date format of netsuite starts from day but javascript was set to month so kinda reverse the day and month
		lastInspection = reverseDate[1] + '/' + reverseDate[0] + '/' + reverseDate[2];
		nlapiSetFieldValue('custrecord_next_inspection_date', addDays((cycleUnit + speriod), lastInspection, unit));
	}
}



//function to set current date when the cycle and scheduling period will be added.
function addDays(daysToAdd, passedDate, unit) {
	var newDate = new Date(passedDate);
	if(unit == 1) { //means the scheduled date is per DAY
		newDate.setDate(newDate.getDate() + daysToAdd);
	} else if(unit == 2) { //means per Month
		newDate.setMonth((newDate.getMonth() + daysToAdd));
	} else if(unit == 3) { //means per year
		newDate.setFullYear(newDate.getFullYear() + daysToAdd);
	}

	return newDate.getDate() + '/' + (Number(newDate.getMonth())+1) + '/' + newDate.getFullYear();
}