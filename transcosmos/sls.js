function sls(request, response) {
	if(request.getMethod() === 'GET') {
		var form = nlapiCreateForm('VAT Relief (SLS)');
		form.addField('taxfrom', 'date', 'Tax Period').setMandatory(true);
		form.addField('taxto', 'date', 'To').setMandatory(true);
		form.addSubmitButton('Download CSV');
		response.writePage(form);
	} else {

		var taxfrom = replaceNull(request.getParameter('taxfrom'));
		var taxto = replaceNull(request.getParameter('taxto'));

		var where = [new nlobjSearchFilter('trandate', null, 'within', taxfrom, taxto)];

		var ret = [new nlobjSearchColumn('trandate')];

		var qry = nlapiSearchRecord(null, 'customsearch88', where, ret);

		if(qry === null) return;
		csvBody = 'PURCHASE TRANSACTION' + '\n' + 
				   'RECONCILIATION OF LISTING FOR ENFORCEMENT' + '\n' + 
				   'REPORT DATE: ' + taxfrom + '\n\n' + 
				   'TIN:000-159-448-0000' + '\n' + 
				   'NAME:Transcosmos Asia Philippines' + '\n' + 
				   'TRADE NAME: Transcosmos Asia Philippines\n' + 
				   'ADDRESS: Pasig City MNLA Philippines 1605\n\n' + 
				   'TAXPAYER IDENTIFICATION NUMBER' + ',' + 
				   'REGISTERED NAME' + ',' + 'NAME OF SUPPLIER (Last Name First Name Middle Name)' + ',' + 
				   'SUPPLIER ADDRESS' + ',' + 'AMOUNT OF GROSS PURCHASE' + ',' + 'AMOUNT OF EXEMPT PURCHASE' + ',' +
				   'AMOUNT OF ZERO RATED PURCHASE' + ',' + 'AMOUNT OF TAXABLE PURCHASE' + ',' + 'AMOUNT OF PURCHASE OF SERVICES' + ',' + 
				   'AMOUNT OF PURCHASE OF CAPITAL GOODS' + ',' + 'AMOUNT OF PURCHASE OTHER THAN CAPITAL GOODS' + ',' + 
				   ' AMOUNT OF PURCHASE SUBJECT TO FINAL VAT WITHELD' + ',' + 'AMOUNT OF INPUT TAX' + ',' + 
				   'AMOUNT OF GROSS TAXABLE PURCHASE' + '\n';

		csvBody += '[1]' + ',' + '[2]' + ',' + '[3]' + ',' + '[4]' + ',' + '[5]' + ',' + '[6]' + ',' + '[7]' + ',' + '[8]' + ',' + '[9]' + ',' + '[10]' + ',' + '[11]' + ',' + '[12]' + ',' + '[13]' + ',' + '[14]' + '\n';

		var excempt = 0;
		var zero = 0;
		var services = 0;
		var othergoods = 0;	
		var lastKey = '';	
		for(var counter = 0; counter < qry.length; counter++) {
			var rawkey = qry[counter]['id'];
		    var loadRec = nlapiLoadRecord('customerpayment', rawkey);
		    if(loadRec === null) return;
			var array_rawvalue = loadRec.getFieldValue('custbody_net_of_wtax');
			var currentKey = replaceNull(qry[counter].getValue('altname', 'customerMain'));
			if(lastKey !== currentKey) {
				excempt = 0;
				zero = 0;
				services = 0;
				othergoods = 0;
			}

		    for(var x = 1; x <= loadRec.getLineItemCount('apply'); x++) { 
		       	var loadRec2 = nlapiLoadRecord('invoice', loadRec.getLineItemValue('apply', 'internalid', x));
		       	if(loadRec2 === null) {
		       		rawvat = 0;
		       		taxrate = 0;
		       	} else {
		       		rawvat = (loadRec2.getLineItemValue('item', 'taxcode', 1) === '' || loadRec2.getLineItemValue('item', 'taxcode', 1) === null) ? 0:loadRec2.getLineItemValue('item', 'taxcode', 1);
		       		taxrate = (parseInt(loadRec2.getLineItemValue('item', 'taxrate1', 1)) / 100);
		       	}
		       
		       var rawvalue = (array_rawvalue[x-1] * taxrate);

		        if(rawvat == 8) {
					excempt += rawvalue;
				} 
				if(rawvat == 7) {
					zero += rawvalue;
				} 
				if(rawvat == 12) {
					services += rawvalue;
				} 
				if(rawvat == 13) {
					services += rawvalue;
				} 
				if(rawvat == 11) {
					othergoods += rawvalue;
				} 
				if(rawvat == 6) {
					othergoods += rawvalue;
				} 
				if(rawvat == 10) {
					othergoods += rawvalue;
				}
		    }
		    var tin = replaceNull(nlapiLookupField('vendor', rawkey, 'vatregnumber'));
          	var regname = replaceNull(nlapiLookupField('vendor', rawkey, 'companyname'));
          	var name = ''; 
          	var supplier = '';
		    if(lastKey !== currentKey) {
		    	csvBody += tin +','+regname+','+name+','+supplier+',"'+AddCommas(tgross)+'","'+AddCommas(excempt)+'","'+AddCommas(zero)+'","'+AddCommas(ttaxable)+'","'+AddCommas(tservices)+'","'+goods+'","'+AddCommas(tothergoods)+'","'+vatwitheld+'","'+AddCommas(tinputtax)+'","'+AddCommas(tgrosspurchase) + '"\n';
		    }



		    lastKey = currentKey;
		}


		var csvObjectInstance = nlapiCreateFile('CSV_File.csv', 'CSV', csvBody)
		csvObjectInstance.setFolder(179);
		var csvId = nlapiSubmitFile(csvObjectInstance);

		//we just have to get the id of the uploaded file and place it in to the iframe 
		//and the browser will do the rest of the work
		var uploaded_file = nlapiLoadFile(csvId);
		var csv_url = uploaded_file.getURL();
		var createObjHtml = '<iframe src = '+csv_url+' width = "0" height = "0"></iframe>';
		 var html = '<html><body><div style = "font-weight: bold; margin-top: 30px; font-size: 30px;">CSV file has been downloaded.</div>' + createObjHtml + '</body></html>';
        response.write(html);
	}
}


function getNextKey(qry, counter) {
	return (replaceNull(qry[counter].getValue('altname', 'customerMain')) === '') ? 0:replaceNull(qry[counter].getValue('altname', 'customerMain'));
}




function replaceNull(value) {
	if(value === null || value === undefined || value === '') {
		return '';
	} else {
		return value;
	}
}


function customInarray(value, currentArray) {
	var inarr = false;
	if(currentArray.length === 0) return inarr;
	for(var i = 0; i < currentArray.length; i++) {
		if(value === currentArray[i])
			inarr = true;
	}

	return inarr;
}

function AddCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)){
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}		

