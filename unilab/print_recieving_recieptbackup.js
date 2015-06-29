/*
Item Receipt - Receiving Receipt Printout
Author: Johanna Morte
Date Created: January 30 2015 Friday
Date Last Modified:
Version 1.0
_ul_ir_rrprintout
*/
function ReceivingReceipt(request, response) {
	html = nlapiGetContext().getSetting('SCRIPT', 'custscript_ul_ir_rrprintout');
	irid = request.getParameter('internalid');
	ir = nlapiLoadRecord('itemreceipt', irid);

	subsidiary = ir.getFieldText('subsidiary');
	ulinvoice = (ir.getFieldValue('custbody_ul_invoiceno') == null) ? '' : ir.getFieldValue('custbody_ul_invoiceno');
	subsidiaryid = ir.getFieldValue('subsidiary');
	subsirecord = nlapiLoadRecord('subsidiary', subsidiaryid);
	subsidiarylocation = subsirecord.getFieldValue('mainaddress_text');
	customer = ir.getFieldText('entity');
	timestamp = ir.getFieldValue('custbody32');
	createdby = ir.getFieldValue('custbody28');
	prnum = (ir.getFieldText('createdfrom') == null) ? '' : ir.getFieldText('createdfrom');
	entityid = ir.getFieldValue('entity');
	try{
		entitytrec = nlapiLoadRecord('customer', entityid);
	} catch (e) {
		entitytrec = nlapiLoadRecord('vendor', entityid);
	}
	address = entitytrec.getFieldValue('defaultaddress');
	docunum = ir.getFieldValue('tranid');
	location = (ir.getFieldText('location') == null) ? '' : ir.getFieldText('location');
	date = ir.getFieldValue('trandate');
	table = '';
	totalamount = 0;

	itemcount = ir.getLineItemCount('item');
	for(var i = 1; i <= itemcount; i++) {
		item = ir.getLineItemText('item', 'item', i);
		desc = (ir.getLineItemValue('item', 'description', i) == null) ? '' : ir.getLineItemValue('item', 'description', i);
		um = (ir.getLineItemValue('item', 'unitsdisplay', i) == null) ? '' : ir.getLineItemValue('item', 'unitsdisplay', i);
		rate = ir.getLineItemValue('item', 'rate', i);
		amount = 0;

		ir.selectLineItem('item', i);
		inventorydetail = ir.viewCurrentLineItemSubrecord('item', 'inventorydetail');
		idcount = inventorydetail.getLineItemCount('inventoryassignment');
		for(var j = 1; j <= idcount; j++) {
			lotnumber = inventorydetail.getLineItemValue('inventoryassignment', 'receiptinventorynumber', j);
			expirationdate = inventorydetail.getLineItemValue('inventoryassignment', 'expirationdate', j);
			quantity = inventorydetail.getLineItemValue('inventoryassignment', 'quantity', j);
			amount = (rate * quantity);
			if(rate == null) {
				rate = '';
				amount = '';
			}
			if(j == 1) {
				table += AddRow(item, desc, lotnumber + ' - ' + expirationdate, quantity, um, rate, nlapiFormatCurrency(amount));
				totalamount += parseFloat(amount);
			} else {
				table += AddRow('', '', lotnumber + ' - ' + expirationdate, quantity, um, rate, nlapiFormatCurrency(amount));
				totalamount += parseFloat(amount);
			}
		}
	}
	var vatamount = totalamount * 0.12;
	html = html.replace('{itemcount}', AddCommas(itemcount));
	html = html.replace('{totalamount}', AddCommas(nlapiFormatCurrency(totalamount)));
	html = html.replace('{vatamount}', AddCommas(nlapiFormatCurrency(vatamount)));
	html = html.replace('{grossamount}', AddCommas(nlapiFormatCurrency(totalamount + vatamount)));
	html = html.replace('{subsidiary}', subsidiary);
	html = html.replace('{ulinvoice}', ulinvoice);
	html = html.replace('{subsidiarylocation}', subsidiarylocation);
	html = html.replace('{customer}', 'Analyn Here');
	html = html.replace('{prnum}', prnum);
	html = html.replace('{address}', address);
	html = html.replace('{docunum}', docunum);
	html = html.replace('{location}', location);
	html = html.replace('{date}', date);
	html = html.replace('{timestamp}', timestamp);
	html = html.replace('{createdby}', createdby);
	html = html.replace('{table}', table);
	html = ReplaceAll(html, '&', '&amp;');

	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', 'ir.pdf', 'inline');
	response.write(file.getValue());
}
function AddRow(a, b, c, d, e, f, g) {
	return	"<tr class='tablecont'>" + 
			"<td class='tablecont'>" + a + "</td>" +
			"<td class='tablecont'>" + b + "</td>" +
			"<td class='tablecont' align='center'>" + c + "</td>" +
			"<td class='tablecont' align='center'>" + AddCommas(d) + "</td>" +
			"<td class='tablecont' align='center'>" + e + "</td>" +
			"<td class='tablecont' align='right'>" + AddCommas(f) + "</td>" +
			"<td class='tablecont' align='right'>" + AddCommas(g) + "</td>" +
			"</tr>";
}