/*
 *Author: HTTP
 *Note: This code snippet is for auto creation of button for Item Issuance and Purchase Request
 *Any change on the form corresponding to deployment will affect the behavior of the script.
 *Date Written: 05/22/2015
*/

function addRemoveCustomer(request, response) {
    
    try {
        //auto create Button after form submit
        var newId = nlapiGetRecordId();
        if(newId === '') return;
        if (type == "view") {
            var create_button = "window.location = '" + nlapiResolveURL('SUITELET', 'customscript_target_list', 'customdeploy1') + "&internalid=" + newId +"&gss=1&ibe=1&chkdsk=1'";
                form.addButton("custpage_send_email", "Add/Remove Customer(s) Nes", create_button);
        }
    } catch (e) {
        if (e instanceof nlobjError) {
            nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
        } else {
            nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
        }
    }   
}