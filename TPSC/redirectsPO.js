/*
 *Author: HTTP
 *Note: This code snippet is to fit the requirements given in requisition
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/

function redirectsPO(request, response) {
    var newID = getUrlVars()['internalid']; //get the passed ID
    var from = getUrlVars()['from']; //get the passed FROM
    //validates if it passes an ID OR the current record is already created then terminates if the requirement is not met
    if(!newID || !from || nlapiGetRecordId() != ''){
        nlapiSetFieldValue('custbody_mwoid', 'edited'); //so that i know after submit that this record has been change
    } else {
        //validates if what button is click from the maintenance work order page and set the default field value for customform
        if(from == 'mwo' && nlapiGetFieldValue('customform') != 103) {
            nlapiSetFieldValue('customform', 103); //set the custom form field value to 103
        }

        if(nlapiGetFieldValue('customform') == 103 && from == 'mwo') {
            nlapiSetFieldValue('custbody7', newID);
            nlapiSetFieldValue('custbody_mwoid', 'mwo');
        }
    }
    
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
