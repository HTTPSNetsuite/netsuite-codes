/*
 *Author: HTTP
 *Note: This code snippet is for auto creation of button for Item Issuance and Purchase Request
 *Any change on the form corresponding to deployment will affect the behavior of the script.
 *Date Written: 05/22/2015
*/

function buttonsOfItemsAndRequest(request, response) {
    
    try {
        //auto create Button after form submit
        var newId = nlapiGetRecordId();
        if(newId === '') return;
        if (type == "view" && nlapiGetFieldValue('custrecord_document_status') != 4) {
            var create_button = "create_button = window.open('https://system.netsuite.com/app/accounting/transactions/purchreq.nl?internalid=" + newId + "&from=mwo', '_new'); create_button.focus();";
            form.addButton("custpage_recrep", "Purchase Request", create_button);
            var create_button1 = "create_button1 = window.open('https://system.netsuite.com/app/accounting/transactions/invadjst.nl?internalid=" + newId + "&from=io', '_new'); create_button.focus();";
            form.addButton("custpage_recrep", "Spare parts issuance", create_button1);
        }
    } catch (e) {
        if (e instanceof nlobjError) {
            nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
        } else {
            nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
        }
    }   
}

