/*
 *Author: HTTP
 *Note: This code snippet is for auto creation of button after form submit
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/

function createButtonSendEmail(request, response) {
    
    try {
        //auto create Button after form submit
        var newId = nlapiGetRecordId();
        if(newId === '') return;
        if (type == "view" && nlapiLookupField('purchaseorder', newId, 'custbody_select_acknowledgement') != '' && nlapiLookupField('purchaseorder', newId, 'approvalstatus') == 2 && (nlapiGetContext().getRole() == 1010 || nlapiGetContext().getRole() == 1009)) {
                var create_button = "window.location = '" + nlapiResolveURL('SUITELET', 'customscript_send_po_email', 'customdeploy_send_po_email') + "&internalid=" + newId + "&tranid="+nlapiLookupField('purchaseorder', newId, 'tranid')+"'";
                form.addButton("custpage_send_email", "Send Email", create_button);
        }
    } catch (e) {
        if (e instanceof nlobjError) {
            nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
        } else {
            nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
        }
    }   
}


function isEdit(request, response) {
    var newId = nlapiGetRecordId();
    if(newId === '') return;
    if (type == "edit") {
        nlapiSetFieldValue('custbody_is_edited', 'T');
    }
}