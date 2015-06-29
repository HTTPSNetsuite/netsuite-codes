function syncFiles(request, response) {
	var form = nlapiCreateForm('PO Status');
	if(request.getMethod() === 'GET') {		
		form.addField('fbd', 'date', 'Date Filter').setMandatory(true);
		var vndr = form.addField('vdr', 'select', 'Vendor');
		vndr.addSelectOption('ev','Ever');
		vndr.addSelectOption('pg','Puregold');
		vndr.addSelectOption('sm','SM');
		vndr.addSelectOption('wm','Walter Mart');
		form.addSubmitButton('Submit');
		response.writePage(form);
	} else {
		var fbd = request.getParameter('fbd');
		var vndor = request.getParameter('vdr');
		var objData = {"date":fbd, "store":vndor};

		//this will check if the response is a valid json object
		var res = nlapiRequestURL('http://107.181.166.115/getSyncFiles', JSON.stringify(objData), {'TOKEN': 'nesmar'});
		try {
			jsn_data = JSON.parse(res.body);
		} catch (exception) {
		  jsn_data = null;
		}

		if (jsn_data) {
		 	var sublist = form.addSubList('polist', 'list', null, 'po_list');
			sublist.addField('custpage_id', 'text', 'ID');
			sublist.addField('custpage_filename', 'text', 'Filename');
			sublist.addField('custpage_store', 'text', 'Store');
			sublist.addField('custpage_issync', 'text', 'Is Sync');
			sublist.addField('custpage_customer_code', 'text', 'Customer Code');
			sublist.addField('custpage_date_created', 'text', 'Date Created');
			sublist.addField('custpage_delivery_date', 'text', 'Delivery Date');
			sublist.addField('custpage_number', 'text', 'Number');

			var counter = 1;
			for(var key in jsn_data['PurchaseOrders']) {
				sublist.setLineItemValue('custpage_id', counter, jsn_data["PurchaseOrders"][key]['Id']);
				sublist.setLineItemValue('custpage_filename', counter, jsn_data["PurchaseOrders"][key]['Filename']);
				sublist.setLineItemValue('custpage_store', counter, jsn_data["PurchaseOrders"][key]['Store']);
				sublist.setLineItemValue('custpage_issync', counter, jsn_data["PurchaseOrders"][key]['IsSync']);
				sublist.setLineItemValue('custpage_customer_code', counter, jsn_data["PurchaseOrders"][key]['CustomerCode']);
				sublist.setLineItemValue('custpage_date_created', counter, jsn_data["PurchaseOrders"][key]['DateCreated']);
				sublist.setLineItemValue('custpage_delivery_date', counter, jsn_data["PurchaseOrders"][key]['DeliveryDate']);
				sublist.setLineItemValue('custpage_number', counter, jsn_data["PurchaseOrders"][key]['Number']);
				counter++;
			}
		} else {
			form.setTitle(res.body);
		}

		response.writePage(form);
	}
}




function replaceNull(value) {
	if(value === null || value === undefined || value === '') {
		return '';
	} else {
		return value;
	}
}