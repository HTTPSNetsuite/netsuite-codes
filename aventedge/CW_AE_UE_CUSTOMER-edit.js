/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Jul 2014     clemen
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord customer
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function customerBeforeLoad(type, form, request) {

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord customer
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function customerBeforeSubmit(type) {

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord customer
 * 
 * @param {String} type Operation types: xedit
 * @returns {Void}
 */
function customerAfterSubmit(type) {
	nlapiLogExecution('DEBUG', 'type', type);

	if (type == 'xedit') {
		try {
			nlapiLogExecution('DEBUG', 'nlapiGetRecordType()', nlapiGetRecordType());
			var newListCodes = [];
			
			var customer = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
			var listCodes = customer.getFieldValues('custentity4');

			if (listCodes != null && listCodes != '') {
				nlapiLogExecution('DEBUG', 'listCodes', listCodes.join(","));
				
				for (var i=0; i < listCodes.length; i++) {
					newListCodes.push(listCodes[i]);
				}
			} else {
				nlapiLogExecution('DEBUG', 'listCodes', 'null');
			}

			var addedListCodeId = customer.getFieldValue('custentity_cw_hidden_list_code');

			if (addedListCodeId != null && addedListCodeId != '') {
				nlapiLogExecution('DEBUG', 'addedListCodeId', addedListCodeId);
				
				newListCodes.push(addedListCodeId);
				nlapiLogExecution('DEBUG', 'newListCodes', newListCodes.join(","));
				
//				nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custentity4', newListCodes, false);
				
//				nlapiSetFieldValue('custentity4', newListCodes);
				
				customer.setFieldValues('custentity4', newListCodes);
				customer.setFieldValue('custentity_cw_hidden_list_code', '');
				
				nlapiSubmitRecord(customer, false, true);
			}
		} catch (e) {
			nlapiLogExecution('ERROR', '[customerAfterSubmit] Runtime Error: ' + e.name, e.message);
		}
	}
}
