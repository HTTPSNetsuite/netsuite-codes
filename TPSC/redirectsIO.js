/*
 *Author: HTTP
 *Note: This code snippet is to fit the requirements given in requisition
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/

function redirectsIO(request, response) {
    var newID = getUrlVars()['internalid']; //get the passed ID
    var from = getUrlVars()['from']; //get the passed FROM
    console.log(newID + ' ' + from);
    //validates if it passes an ID OR the current record is already created then terminates if the requirement is not met
    if(!newID || !from || nlapiGetRecordId() != ''){
        nlapiSetFieldValue('custbody_mwoid', 'edited'); //so that i know after submit that this record has been change
    } else {
        //validates if what button is click from the maintenance work order page and set the default field value for customform
        if(from == 'io' && nlapiGetFieldValue('customform') != 121) {
            nlapiSetFieldValue('customform', 121); //set the custom form field value to 103
        }

        if(nlapiGetFieldValue('customform') == 121 && from == 'io') {
            nlapiSetFieldValue('custbody7', newID);
            nlapiSetFieldValue('custbody_mwo_from', 'io');
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
