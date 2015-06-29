function slp(request, response) {
	if(request.getMethod() === 'GET') {
		var form = nlapiCreateForm('VAT Relief (SLP)');
		form.addField('taxfrom', 'date', 'Tax Period').setMandatory(true);
		form.addField('taxto', 'date', 'To').setMandatory(true);
		form.addSubmitButton('Download CSV');
		response.writePage(form);
	} else {

		var taxfrom = replaceNull(request.getParameter('taxfrom'));
		var taxto = replaceNull(request.getParameter('taxto'));

		var where = [new nlobjSearchFilter('trandate', null, 'within', taxfrom, taxto)];

		var ret = [new nlobjSearchColumn('trandate')];

		var qry = nlapiSearchRecord(null, 'customsearch_vendor_bills', where, ret);

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

		//we have to create 3 arrays to easily track down the returned record and we can 
		//group them per bills and group/compute their vats
		var lastType = '';
		var lastKey = '';
		var excempt = 0;
		var zero = 0;
		var taxable = 0;
		var services = 0;
		var othergoods = 0;
		var row = [];
        var taxzero = 0;
		var taxexcempt = 0;
		var taxtaxable = 0;
		var taxservices = 0;
		var taxothergoods = 0;
		var grandgross = 0;
		var grandex = 0;
		var grandzero = 0;
		var grandttax = 0;	
		var grandservices = 0;
		var grandcapital = 0;
		var grandother = 0;
		var grandtax = 0;
		var grosspur = 0;
		for(var counter = 0; counter < qry.length; counter++) {
			//2nd try tingnan natin kung kaya parang mali yung algorith natin sa una na ilagay sa array
			//gagawin natin kunin na lahat kaagad
			//check first if the key is exist on the compiled array
			var rawkey = replaceNull(qry[counter].getValue('custbody_approved_vendors'));		
			//pusang gala ayaw nia ng increment by counter sa array,.... ayaw ng netsuite haha what a platform
			//gustu naman ni console eh..kung ayaw tatawagin natin sa function..
			if(rawkey === '') rawkey = 0; 
			var rawkey2 = (counter === qry.length-1) ? '': getNextKey(qry, counter+1);
			var rawamount = replaceNull(qry[counter].getValue('grossamount'));
			//replace the comma created by netsuite
			rawamount = rawamount.replace(/,/g, '');
			//replace also the .00 at the last or the decimal
			rawamount = rawamount.replace('.00', '');
			var rawvalue = (parseFloat(rawamount)) ? parseFloat(rawamount):0;
			var rawnegate = replaceNull(qry[counter].getValue('taxtotal'));
			rawnegate = rawnegate.replace(/,/g, '');
			//replace also the .00 at the last or the decimal
			rawnegate = rawnegate.replace('.00', '');
			var tax = (parseFloat(rawnegate)) ? parseFloat(rawnegate):0;
			if(tax != 0) {
				rawvalue = tax / 0.12;
			}
			var name = '';
			var tin = '';
			var regname = '';
			var supplier = '';
			var rawvat = 8;
			if(qry[counter].getValue('type') == 'VendBill') {
				var loadRec = nlapiLoadRecord('vendorbill', qry[counter]['id']);
				var rawvat = loadRec.getLineItemValue('item', 'taxcode', 1);
				if(rawvat == null) {
					loadRec = nlapiLoadRecord('vendorbill', qry[counter]['id']);
					rawvat = loadRec.getLineItemValue('expense', 'taxcode', 1);
				}
				var sup = nlapiLoadRecord('vendor', rawkey);	          	
				tin = replaceNull(sup.getFieldValue('vatregnumber'));
	          	regname = replaceNull(sup.getFieldValue('companyname'));
	          	supplier = replaceNull(sup.getLineItemValue('addressbook', 'addr1', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'addr2', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'city', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'dropdownstate', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'zip', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'country', 1));
	          	supplier = supplier.replace(',');
			} else if(qry[counter].getValue('type') == 'ExpRept') {
				var loadRec = nlapiLoadRecord('expensereport', qry[counter]['id']);
				var rawvat = loadRec.getLineItemValue('expense', 'taxcode', 1);					
          		name = qry[counter].getValue('entityid', 'employee'); 
			} else if(qry[counter].getValue('type') == 'VendCred') {
				var loadRec = nlapiLoadRecord('vendorcredit', qry[counter]['id']);
				var rawvat = loadRec.getLineItemValue('item', 'taxcode', 1);
				if(rawvat == null) {
					loadRec = nlapiLoadRecord('vendorcredit', qry[counter]['id']);
					rawvat = loadRec.getLineItemValue('expense', 'taxcode', 1);
				}
	          	var sup = nlapiLoadRecord('vendor', rawkey);	          	
				tin = replaceNull(sup.getFieldValue('vatregnumber'));
	          	regname = replaceNull(sup.getFieldValue('companyname'));
	          	supplier = replaceNull(sup.getLineItemValue('addressbook', 'addr1', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'addr2', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'city', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'dropdownstate', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'zip', 1)) + ' ' + replaceNull(sup.getLineItemValue('addressbook', 'country', 1));
	          	supplier = supplier.replace(',');
			}
		
			

			//at dahil sa nalito na ako... haaayyyy di ko na to ilagay sa function
           if((lastKey === rawkey && lastType === rawvat) || lastKey === rawkey) { 
           } else { 
              	zero = 0;
				excempt = 0;
				services = 0;
				othergoods = 0;
                taxzero = 0;
                taxexcempt = 0;
                taxtaxable = 0;
                taxservices = 0;
                taxothergoods = 0;
           }

           if(rawvat == 8) {
				excempt += rawvalue;
                taxexcempt += tax;
			} 
			if(rawvat == 7) {
				zero += rawvalue;
                taxzero += tax;
			} 
			if(rawvat == 12) {
				services += rawvalue;
                taxservices += tax;
			} 
			if(rawvat == 13) {
				services += rawvalue;
                taxservices += tax;
			} 
			if(rawvat == 11) {
				othergoods += rawvalue;
                taxothergoods += tax;
			} 
			if(rawvat == 6) {
				othergoods += rawvalue;
                taxothergoods += tax;
			} 
			if(rawvat == 10) {
				othergoods += rawvalue;
                taxothergoods += tax;
			} 

          	

          	if(rawkey !== rawkey2) {
           		var tservices = (services - taxservices);
           		var tothergoods = (othergoods - taxothergoods);
           		var ttaxable = (tservices + tothergoods);
           		var tinputtax = (taxservices+taxothergoods);
           		var tgrosspurchase = (ttaxable + tinputtax);
           		var tgross = (ttaxable + excempt);
           		var goods = 0, vatwitheld = 0;
           		csvBody += tin +','+regname+','+name+','+supplier+',"'+AddCommas(tgross)+'","'+AddCommas(excempt)+'","'+AddCommas(zero)+'","'+AddCommas(tgrosspurchase)+'","'+AddCommas(tservices)+'","'+goods+'","'+AddCommas(tgrosspurchase)+'","'+vatwitheld+'","'+AddCommas(tinputtax)+'","'+AddCommas(tgrosspurchase) + '"\n';
           		grandgross += tgross;
				grandex += excempt;
				grandzero += zero;
				grandttax += ttaxable;	
				grandservices += tservices;
				grandother += tothergoods;
				grandtax += tinputtax;
				grosspur += tgrosspurchase;
           	}

           lastKey = rawkey;
           lastType = rawvat;

		}

		csvBody+= ',,,Grand Total,"'+AddCommas(grandgross)+ '","' + AddCommas(grandex)+ '","' + AddCommas(grandzero)+ '","'+ AddCommas(grosspur)+ '","'+AddCommas(grandservices)+'",0,"'+AddCommas(grosspur)+'",0,"'+AddCommas(grandtax) +'","'+AddCommas(grosspur)+'"\n';



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
	return (replaceNull(qry[counter].getValue('custbody_approved_vendors')) === '')? 0:replaceNull(qry[counter].getValue('custbody_approved_vendors'));
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
