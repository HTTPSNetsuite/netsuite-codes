/*
 *Author: HTTP
 *Note: This code snippet is for PO Feedback 
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/


function commentOnPO(request, response) {
	var form = nlapiCreateForm('PO Acknowledgement');	//create form element
	if(request.getMethod() == 'GET') { //validate if the method
		//validate if the PO number is present on the url
		if(request.getParameter('poId') == '' || request.getParameter('poId') == null) {
			form.setTitle('Error: Undefined PO number! Please contact the administrator.'); //displays an error if PO number not present
		} else {

			//we just have to validate if this link is already click before
			//search on the record types for available records
			filters = [	
					new nlobjSearchFilter('custrecord_po_id', null, 'is', request.getParameter('poId')), 
					new nlobjSearchFilter('custrecord_is_visited', null, 'is', 'T')
			];

			columns = [ new nlobjSearchColumn('custrecord_po_id')];

			is_confirmed = nlapiSearchRecord('customrecord_po_confirmation', null, filters, columns); //we search on the record types the filtered id

			//decide if the this link is already click but did not save
			if(is_confirmed == null || request.getParameter('edit') == 'T') {
				form.addField('tranid', 'text', 'PO ID').setDefaultValue(request.getParameter('tranid'));
				form.addField('po_id', 'text', 'Hidden ID').setDefaultValue(request.getParameter('poId'));
				form.getField('tranid').setDisplayType('disabled'); 
				form.getField('po_id').setDisplayType('hidden');
				form.addField('comment', 'textarea', 'Comment');
				form.addField('ack', 'radio','Acknowledge', 'ackn').setLayoutType('midrow');
				form.addField('ack', 'radio','Not Acknowledge', 'notAck').setLayoutType('midrow');
				form.getField('ack','ackn').setDefaultValue('ackn');

				form.addSubmitButton('Submit');
			} else {
				form.setTitle('Error: Expired or invalid link.'); //displays an error if the link is already clicked
			}
		}
		response.writePage(form);		
	} else {
		var radioB = request.getParameter('ack');
		var comment = request.getParameter('comment');
		var po_id = request.getParameter('po_id');
		var objData = {"po_id":po_id, "comment":comment, "radioB":radioB};
		var headers = {"User-Agent-x": "SuiteScript-Call", "Authorization": "NLAuth nlauth_account=4086480, nlauth_email=netsuite.nesmarpatubo@gmail.com, nlauth_signature=Netsuite01", "Content-Type": "application/json"};
		var res = nlapiRequestURL('https://rest.netsuite.com/app/site/hosting/restlet.nl?script=179&deploy=1', JSON.stringify(objData), headers);

		try {
			json_response = JSON.parse(res.body);
		} catch (exception) {
		  json_response = null;
		}

		form.setTitle(json_response.toString());
		response.writePage(form);
	}
}
