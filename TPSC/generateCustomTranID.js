/*
 *Author: Nesmar Patubo
 *Note: This code snippet is for auto generating the tran id of the PO
 *Any change on the PO behavior will affect the functionality of this code.
 *Date reset will be based on the system date or the current date
 *Date Written: 05/21/2015
 *Edited again for another requirements
*/


function generateCustomTranId() {
	//we have to validate if the PO is new or existing or auto creation of PO
	var po_id = nlapiGetFieldValue('tranid');
	//there is no scenario that the tranid woud be null unless the onload function below was late to execute
	var splitPO = (po_id.toString()).split('');
	if(splitPO[0] == 'C' || splitPO[0] == 'N' || splitPO[0] == 'B')return;

	//get first the selected nature of transaction
	var tranType = nlapiGetFieldValue('customform');
	//here we will define an algorithm for generating the custom tranID
	//we do not want to passed the other numbering format on the custom record type
	//just the counter and only the counter 

	filters = [	new nlobjSearchFilter('custrecord4', null, 'is', tranType)];
	columns = [ new nlobjSearchColumn('custrecord5'), 
				new nlobjSearchColumn('custrecord_month')
			];
	
	numberSeries = nlapiSearchRecord('customrecord80', null, filters, columns); //we search on the record types
	if(numberSeries == null) return; 
	var loadRecTypes = nlapiLoadRecord('customrecord80', numberSeries[0]['id']); //we load the record type base on the filtered id

	//formulate the other numbering characters
	var initial = '';
	if(tranType == "102") { //means its contract purchase order
		initial = 'C';
	} else if(tranType == "100") { //then its standard purchase order
		initial = 'N';
	} else if(tranType == "101") { //means its a blanket purchase order
		initial = 'B';
	}

	//will working on getting the last 2 chars of date
	var new_date = new Date();
	var year = ((new_date.getFullYear()).toString()).slice(-2); //here we get the last 2 char of the year e.g. 2015=15

	//get the value of last counter in the custom record types
	var counter = parseInt(numberSeries[0].getValue('custrecord5'));


	//then will reset the value of counter in the custom record type every first of the month
	if(new_date.getDate() === 1) {
		var newMonth = numberSeries[0].getValue('custrecord_month');
		if(new_date.getMonth() == 11)  newMonth = -1;
		if(newMonth == new_date.getMonth()) {
			counter = 0;
			loadRecTypes.setFieldValue('custrecord_month', parseInt(newMonth)+1);
		}
	}

	//but we will create a 4 char format for counter like this 0001, 0002, 0003, 0010, 0020
	var format_counter = formatCounter(counter+1);

	//append 0 if the month is a single char
	var month = '';
	if(((new_date.getMonth()).toString()).length === 1){
		month = '0' + (new_date.getMonth()+1);
	}

	// I think we got all the nescessary format, so lets sum up what we got
	var new_numbering = initial + year.toString() + month.toString() + format_counter;


	//were good now lets update the value of the custom record type and the PO itself
	nlapiSetFieldValue('tranid', new_numbering);
	loadRecTypes.setFieldValue('custrecord5', (counter+1).toString());
	nlapiSubmitRecord(loadRecTypes);


}

function setPODefaultValue() {
	nlapiSetFieldValue('tranid', 'To be generated');
}

function formatCounter(s) { 
	s = s.toString();
    while (s.length < 4) {
      s = '0' + s; 
    }

    return s;
}
