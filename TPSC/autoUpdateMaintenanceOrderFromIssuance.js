/*
 *Author: HTTP
 *Note: This code snippet is to fit the requirements given in requisition
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/

function autoUpdateMaintenanceOrderFromIssuance(type, form) {
    if(nlapiGetRecordId() == '') return;
    if(nlapiGetFieldValue('custbody7') == '' || nlapiGetFieldValue('custbody7') == null) return;

    if(nlapiGetFieldValue('custbody_mwo_from') === 'io') {
        var createRecord = nlapiCreateRecord('customrecord321');
        createRecord.setFieldValue('custrecord160', nlapiGetRecordId());
        createRecord.setFieldValue('custrecord162', nlapiGetFieldValue('custbody7'));
        nlapiSubmitRecord(createRecord);
    }

}

