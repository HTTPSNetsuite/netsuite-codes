/*
	*Author: [HTTP]
	*THis code snippet will make those selected fields mandatory
*/

function setMandatory(type, name, line) {
	if(name == 'custrecord153') {
		nlapiDisableField('custrecord154', false);
		nlapiSetFieldValue('custrecord_document_status', '');
		nlapiSetFieldMandatory('custrecord154', false);
		nlapiDisableField('custrecord247', false);
		nlapiSetFieldMandatory('custrecord248', false);
		nlapiDisableField('custrecord248', false);
		nlapiSetFieldMandatory('custrecord247', false);
		nlapiSetFieldValue('custrecord_document_status', '');
		if(nlapiGetFieldValue('custrecord153') == 2) {
			nlapiSetFieldValue('custrecord_document_status', 2);
		} else {
			nlapiSetFieldValue('custrecord_document_status', 1);
			if(nlapiGetFieldValue('custrecord153') == 6) {
				nlapiSetFieldMandatory('custrecord154', true);
				nlapiDisableField('custrecord248', true);
				nlapiSetFieldMandatory('custrecord247', true);
			} else {
				nlapiDisableField('custrecord154', true);
				nlapiDisableField('custrecord247', true);
				nlapiSetFieldMandatory('custrecord248', true);
			}   			
		}
	}

	if(name == 'custrecord_document_status') {	
		nlapiSetFieldMandatory('custrecord_cause_code', false);
		nlapiSetFieldMandatory('custrecord_failure_code', false);
		nlapiSetFieldMandatory('custrecord_closing_comment', false);
		nlapiSetFieldMandatory('custrecord_activity_type', false);
		nlapiSetFieldMandatory('custrecord154', false);
		nlapiSetFieldValue('custrecord_end_date', '');
		if(nlapiGetFieldValue('custrecord_document_status') == 2 || nlapiGetFieldValue('custrecord_document_status') == 3) {
			nlapiSetFieldMandatory('custrecord_activity_type', true);
			nlapiSetFieldValue('custrecord128', nlapiGetUser());
		} else if(nlapiGetFieldValue('custrecord_document_status') == 4) {
			nlapiSetFieldMandatory('custrecord_cause_code', true);
			nlapiSetFieldMandatory('custrecord_failure_code', true);
			nlapiSetFieldMandatory('custrecord_closing_comment', true);
			if(nlapiGetFieldValue('custrecord212') == 6) {
				nlapiSetFieldValue('custrecord_end_date', getCurrentDate());
			}
		}
	}

	if(name == 'custrecord212') {	
		if(nlapiGetFieldValue('custrecord212') == 6) {
			nlapiSetFieldValue('custrecord_end_date', getCurrentDate());		
		} else {
			nlapiSetFieldValue('custrecord_end_date', '');
		}
	}

	if(name == 'custrecord_priority') {
		var newDate = new Date();
		var thisDate;
		if(nlapiGetFieldValue('custrecord_priority') == 2) {  //means its urgent			
			thisDate = newDate.setDate(newDate.getDate()+4);
		}
		thisDate = newDate.getDate() + '/' + (Number(newDate.getMonth())+1) + '/' + newDate.getFullYear();
		nlapiSetFieldValue('custrecord_start_date', thisDate);
	}

}


function onLoadSetMandatory() {
	nlapiSetFieldMandatory('custrecord_problem_code', true);
	nlapiSetFieldMandatory('custrecord_source_list', true);
	nlapiSetFieldMandatory('custrecord152', true);
	nlapiSetFieldMandatory('custrecord_created_by', true);
	nlapiSetFieldMandatory('custrecord_planner', true);
	nlapiSetFieldMandatory('custrecord_reported_by', true);
}


function getCurrentDate() {
	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 
    today = dd+'/'+mm+'/'+yyyy;
    return today;
}
