/*
 *Author: HTTP
 *Note: This code snippet is to fit the requirements given in requisition
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/

function autoUpdateMaintenanceOrder(type, form) {
    if(nlapiGetRecordId() == '') return;
    if(nlapiGetFieldValue('custbody7') == '' || nlapiGetFieldValue('custbody7') == null) return;

    if(nlapiGetFieldValue('custbody_mwoid') === 'mwo') {
        var createRecord = nlapiCreateRecord('customrecord322');
        createRecord.setFieldValue('custrecord163', nlapiGetRecordId());
        createRecord.setFieldValue('custrecord164', nlapiGetFieldValue('custbody7'));
        nlapiSubmitRecord(createRecord);
    }

}

