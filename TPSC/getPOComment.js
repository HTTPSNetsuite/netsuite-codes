/*
 *Author: HTTP
 *Note: This code snippet is for PO Restlet  to post any passed data and update to netsuite DB 
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/

function getPOComment(datain) {   

	try {
		//load the record with the id above
		var loadRec = nlapiLoadRecord('purchaseorder', datain.po_id);

		//update the PO with the ID (po_id)
		loadRec.setFieldValue('custbody_po_comment', datain.comment);

		if(datain.radioB == 'ackn') {
			loadRec.setFieldValue('custbody_not_acknowledge', 'F');
			loadRec.setFieldValue('custbody_acknowledge', 'T');			
		} else if(datain.radioB == 'notAck') {
			loadRec.setFieldValue('custbody_not_acknowledge', 'T');
			loadRec.setFieldValue('custbody_acknowledge', 'F');
		}

		/*
			validate if the system will update or save the record type
		*/
		//pusang gala ayaw nia ng global variable.. ganito na nga lang
		filters = [	
					new nlobjSearchFilter('custrecord_po_id', null, 'is', datain.po_id), 
					new nlobjSearchFilter('custrecord_is_visited', null, 'is', 'T')
			];

		columns = [ new nlobjSearchColumn('custrecord_po_id')];

		is_confirmed = nlapiSearchRecord('customrecord_po_confirmation', null, filters, columns); //we search on the record types the filtered id
		if(is_confirmed == null) {
			var new_record = nlapiCreateRecord('customrecord_po_confirmation');
			new_record.setFieldValue('name', 'PO # ' + datain.po_id);
			new_record.setFieldValue('custrecord_po_id', datain.po_id);
			new_record.setFieldValue('custrecord_is_visited', 'T');
			nlapiSubmitRecord(new_record);
		}	

		nlapiSubmitRecord(loadRec);
		return "Acknowledgement Updated!";
	} catch(e) {
		 if (e instanceof nlobjError) {
            return e.getCode() + '\n' + e.getDetails() + '\n' + "Please contact administrator.";
        } else {
            return e.toString() + '\n' + "Please contact administrator.";
        }
	}

}