/*
 *Author: HTTP
 *Note: This code snippet is for sending po email acknowledgement after clicking the send mail button
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
 *Edited on 06/02/2015. Includes the multiple attachments of files from the Purchase order records and the 
 *custom pdf template created by LEAN
*/


function sendPOEmail(request, response) {
	var recordId = request.getParameter('internalid');
	if(recordId == '')return;
	var loadRec = nlapiLoadRecord('purchaseorder', recordId);
	var email = loadRec.getFieldValue('email');
	email = email.split(';');
	var form = '';
	if(email == '' || email == null) {
		form = nlapiCreateForm('No recipient! Please check the Purchase Order Info.');
	} else {
		var xml = '';
        var record = nlapiLoadRecord('purchaseorder', recordId);
        var renderer = nlapiCreateTemplateRenderer();
        var template = formulateTemplate(); //gets the string template created by LEAN
        renderer.setTemplate(template);
        renderer.addRecord('record', record);
        xml = xml +  renderer.renderToString();
        var customPDFTemplate = nlapiXMLToPDF(xml);

        //gets all the attached files from this record via saved search
        var where = [ new nlobjSearchFilter('internalid', null, 'is', recordId)];
		var ret = [ new nlobjSearchColumn('internalid', 'file')
				];
		
		var qry = nlapiSearchRecord(null, 'customsearch_get_all_attachments', where, ret); //we search on the saved search
		var newAttachment = [];
		newAttachment.push(customPDFTemplate);
		if(qry != null) {
			for(var counter = 0; counter < qry.length; counter++) {
				if(qry[counter].getValue('internalid', 'file') != '') {
					newAttachment.push(nlapiLoadFile(qry[counter].getValue('internalid', 'file')))
				}
			}
		}
   
		var body = '<meta http-equiv="content-type" content="text/html; charset=UTF-8">Attached to this e-mail is: <br />' + 
		           'Purchase Order ' + loadRec.getFieldValue('tranid') + ' to supplier ' + nlapiLookupField('vendor', loadRec.getFieldValue('entity'), 'companyname');

		body += '<br /><br />Ordered by: <br />' + 
				'TPSC Asia PTE LTD <br />' + 
				'53 Tuas Crescent <br />' + 
				'Singapore 638732 <br /><br />';

		if(loadRec.getFieldValue('custbody_select_acknowledgement') == '1') {	
			body += 'Click on this link to send <a href = "https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=170&deploy=1&compid=4086480&h=d38be19e2e7403438d6a&poId='+recordId+'&edit='+loadRec.getFieldValue('custbody_is_edited')+'&tranid='+loadRec.getFieldValue('tranid')+'&radioB='+loadRec.getFieldValue('custbody_select_acknowledgement')+'">ACKNOWLEDGE</a> reciept of this order. <br /><br />' + 
					'<span style = "color: red">Warning: The link mentioned above can only be processed once.<br />'+
					'Note that in case the purchaser modifies the PO, a new e-mail will be sent.</span><br /><br />';
		}

		body += '<span style = "color: blue">For more information, please contact our responsible purchaser.<br />'+
				'Contact Details:</span><br />' + 
				'Email: '+nlapiLookupField('employee', nlapiGetContext().getUser(), 'email')+'<br />' + 
				'Phone: '+nlapiLookupField('employee', nlapiGetContext().getUser(), 'phone')+'<br />' + 
				'Fax: '+nlapiLookupField('employee', nlapiGetContext().getUser(), 'fax');

		var subject = loadRec.getFieldValue('tranid') + '-' + nlapiLookupField('vendor', loadRec.getFieldValue('entity'), 'companyname');
		var cc = loadRec.getFieldValue('custbody_cc');
		var bcc = loadRec.getFieldValue('custbody_bcc');
	 
		nlapiSendEmail(nlapiGetContext().getUser(), email, subject, body, cc, bcc, null, newAttachment);
		form = nlapiCreateForm('Email Sent');
	}	
	response.writePage(form);
}


function formulateTemplate() {
	return '<!--?xml version="1.0" ?--><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd"><pdf><head><#if .locale=="ru_RU"> <link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2"/></#if> <macrolist> <macro id="nlheader"> <table style="padding-top:-40px" width="100%"><tr><td width="41%"><p> <img src="https://system.netsuite.com/core/media/media.nl?id=268&amp;c=4086480&amp;h=b4dde5bf7fff1339a605&amp;whence=" width="80" height="76"></img></p></td></tr><tr><td class="head" width="33%"><b>PURCHASE ORDER</b></td><td class="head" style="text-align:left" width="33%"><b>${record.tranid}</b></td><td class="head" width="33%"> </td></tr><tr><td colspan="3"><p><b>To be mentioned on all documents</b></p></td></tr></table> </macro> <macro id="nlfooter"> <p align="center" style="padding-top:10pt">Page <pagenumber/> of <totalpages/></p><p align="left" style="padding-top:-20pt">_______________________________________________________________________________________<br/><b>TPSC Asia Pte Ltd</b><br/>53, Tuas Crescent Singapore 638732 - Tel: (65) 6862 1228 - Fax: (65) 6862 3179<br/>GST Reg No.M2-0065786-1 - Company Reg No.: 198305378K</p></macro> </macrolist> <style type="text/css">table{<#if .locale=="zh_CN"> font-family: stsong, sans-serif; <#elseif .locale=="zh_TW"> font-family: msung, sans-serif; <#elseif .locale=="ja_JP"> font-family: heiseimin, sans-serif; <#elseif .locale=="ko_KR"> font-family: hygothic, sans-serif; <#elseif .locale=="ru_RU"> font-family: verdana; <#else> font-family: sans-serif; </#if> font-size: 9pt; table-layout: fixed;}.head{font-size: 19px;}.tablesecond{position: relative; table-layout: fixed; width: 60%;}.tablesecond td{padding: 0px;}#leftp{width: 49.5%; font-stretch: semi-condensed; font-size: 8px;}#rightp{width: 49.5%; font-stretch: semi-condensed; font-size: 8px;}.nextl{white-space: normal;}th{font-weight: bold; font-size: 8pt; vertical-align: middle; padding: 5px 6px 3px; background-color: #e3e3e3; color: #333333;}td{padding: 4px 6px;}b{font-weight: bold; color: #333333;}table.header td{padding: 0; font-size: 10pt;}table.footer td{padding: 0; font-size: 8pt;}table.itemtable th{padding-bottom: 10px; padding-top: 10px;}table.body td{padding-top: 2px;}table.total{page-break-inside: avoid;}tr.totalrow{background-color: #e3e3e3; line-height: 200%;}td.totalboxtop{font-size: 12pt; background-color: #e3e3e3;}td.addressheader{font-size: 8pt; padding-top: 6px; padding-bottom: 2px;}td.address{padding-top: 0;}td.totalboxmid{font-size: 28pt; padding-top: 20px; background-color: #e3e3e3;}td.totalboxbot{background-color: #e3e3e3; font-weight: bold;}span.title{font-size: 28pt;}span.number{font-size: 16pt;}span.itemname{font-weight: bold; line-height: 150%;}hr{width: 100%; color: #d3d3d3; background-color: #d3d3d3; height: 1px;}</style></head><body header="nlheader" header-height="11%" footer="nlfooter" footer-height="7%" padding="0.5in 0.5in 0.5in 0.5in" size="A4"> <table height="20%" width="100%"><tr><td style="background-color:#e3e3e3; border:2px solid black" width="49.8%"><b>General Information</b></td><td width=".4%"> </td><td style="background-color:#e3e3e3; border:2px solid black" width="49.8%"><b>Vendor Information</b></td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Purchase Order date: ${record.trandate}</b></td><td> </td><td style="border-left:2px solid black; border-right:2px solid black">${record.entity}<br/>${record.billaddress}</td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Our contact:</b> ${record.custbody5}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Our phone:</b> ${record.custbody5.phone}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Our fax:</b> ${record.custbody5.fax}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Our E-Mail:</b> ${record.custbody5.email}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"> </td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"><b>Your contact:</b> ${record.entity.contact}</td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"> </td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"><b>Your phone: </b>${record.entity.phone}</td></tr><tr><td style="background-color:#e3e3e3; border:2px solid black"><b>Delivery Information</b></td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"><b>Your fax:</b> ${record.fax}</td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Delivery Address:</b><br/><br/><span class="nameandaddress">${companyInformation.companyName}</span><br/><span class="nameandaddress">${companyInformation.addressText}</span></td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"><b>Your vendor no.:</b> ${record.id}</td></tr><tr><td align="center" style="border-left:2px solid black; border-right:2px solid black"> </td><td> </td><td style="background-color:#e3e3e3; border:2px solid black"><b>Invoicing Information</b></td></tr><tr><td align="center" style="border-left:2px solid black; border-right:2px solid black"> </td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"><b>Billing Address:</b><br/><br/><span class="nameandaddress">${companyInformation.companyName}</span><br/>Accounting Department<br/><span class="nameandaddress">${companyInformation.addressText}</span></td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Our contact:</b> ${record.employee}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Our phone:</b> ${record.employee.phone}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Our E-Mail:</b> ${record.employee.email}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black"><b>Delivery date:</b> ${record.duedate}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black"> </td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black; border-bottom:2px solid black"><b>Delivery Term:</b> ${record.custbody4}</td><td> </td><td style="border-left:2px solid black; border-right:2px solid black; border-bottom:2px solid black"><b>Payment term:</b> ${record.terms}</td></tr></table><p>Your quotation / reference number : ${record.otherrefnum}</p><p>${record.custbody2}</p><#if record.item?has_content><table class="itemtable" style="width: 100%; margin-top:-20pt"><#list record.item as item><#if item_index==0><thead><tr><th align="center" colspan="3">${item.item@label}</th><th colspan="12"><b>Material</b>/${item.description@label}</th><th colspan="3">${item.quantity@label}</th><th align="right" colspan="2">${item.units@label}</th><th align="right" colspan="5"><b>Price per unit</b></th><th align="right" colspan="4"><b>Value in SGD</b></th></tr></thead></#if><tr><td align="center" colspan="3" line-height="150%">${item_index+1}</td><td colspan="12"><span class="itemname">${item.item}</span><br/>${item.description}<br/>${item.expectedreceiptdate}</td><td colspan="3">${item.quantity}</td><td align="right" colspan="2">${item.units}</td><td align="right" colspan="5">${item.rate}${record.currency}/${item.units}</td><td align="right" colspan="4">${item.amount}</td></tr></#list></table></#if><#if record.expense?has_content></#if><table class="total" style="width: 100%; margin-top:-20px; background-color: #e3e3e3"><tr><td align="center" colspan="3" line-height="150%"> </td><td colspan="3"> </td><td align="center" colspan="12"><b>Total value before GST</b></td><td align="right" colspan="2"> </td><td align="right" colspan="5"> </td><td align="right" colspan="4">${record.subtotal}</td></tr></table><div align="center"><p>${record.custbody3}</p><p>We ask you to acknowledge receipt of this order or these delivery instructions when sending back to us by fax this document duly signed and with the mention "AUTHORIZED BY" and your stamp. Note that in the case the acknowledgment is performed by e-mail, filling this section is not required.</p><table align="center" class="tablesecond"><tr><td align="center" colspan="2" style="border: 2px solid black; padding:2px"><b>ORDER ACKNOWLEDGEMENT</b></td></tr><tr><td style="border-left:2px solid black; border-right:2px solid black; padding:2px"><b>Signature Vendor</b></td><td style="border-right:2px solid black; padding:2px"><b>Stamp Vendor</b></td></tr><tr><td style="border:2px solid black; height:30"> </td><td style="border-right:2px solid black;border-bottom:2px solid black;border-top:2px solid black;height:30"> </td></tr></table><p align="center">This purchase order is validated electronically by<br/>${record.custbody13}<br/>${record.custbody14}<br/>${record.custbody15}</p></div><table width="100%"><tr><td id="leftp"><p><b>Interpretation</b><br/>1. In these conditions, (a) "Buyer" means TPSC Asia Pte Ltd. (b) "Buyer&#39;s Order" means the Buyer&#39;s Order for the purchase of goods as constituted by the terms overleaf, the Conditions and the Special Conditions; (c) "Conditions" means the terms and conditions of purchase herein; (d) "Contract" means the contract for the sale of the Goods as Constituted by the Buyer&#39;s Order and Seller&#39;s acceptance thereof; (e) "Goods" means the goods comprised in the Buyer&#39;s Order; (f) "Incoterms" means the International rules for the interpretation of trade terms of the International Chamber of Commerce currently in force; (g) "Seller" means the person or entity who accepts the Buyer&#39;s Order; (h) "Special Conditions" means the special conditions (if any) of the Buyer delivered herewith or applicable hereto.</p><p><b>Terms</b><br/>2. The Seller shall sell and the Buyer shall purchase the Goods in accordance with and subject to the terms of the Buyer&#39;s Order. The terms overleaf, the Conditions and the Special Conditions shall apply to the exclusion of all other terms upon which the Seller may purport to accept the Buyer&#39;s Order or to supply the Goods. In the event of any inconsistencies, the Special Conditions shall prevail over the terms, overleaf, which shall in turn prevail over the Conditions.</p><p>3. The rights and remedies of the Buyer under the Conditions are additional to and without prejudice to any rights and remedies conferred on the Buyer under statutory or general law and the terms and conditions herein are additional to and without prejudice to any terms, conditions, representations and warranties subsisting or implied in favour of the Buyer under statutory or general law.</p><p>4. All express and/or implied representations and warranties made or issued by the Seller prior to the Contract in connection with and/or relating to the Goods or the sale thereof shall constitute a part of the Contract.</p><p><b>Price</b><br/>5. The price of the Goods shall be that stated overleaf or in the Special Conditions and the Seller shall further be responsible for and/or shall reimburse the Buyer for all taxes, levies and payment imposed in respect of the sale of Goods to the Buyer.</p><p>6. The Seller shall invoice the Buyer for the Goods further to delivery and the Buyer shall pay for the price of the Goods per the Buyer&#39;s term stated overleaf provided always that such payment need not be made if the Buyer has rejected the Goods.</p><p><b>Delivery</b><br/>7. The time or times stated overleaf or in the Special Conditions for the delivery shall be of the essence and unless the Buyer&#39;s Order has been previously accepted shall constitute acceptance of the Buyer&#39;s Order.</p><p>8. Delivery of the Goods shall be made at such place and upon such terms as to costs, expenses, shipping insurance or otherwise as may be expressed or implied from the terms (including trade terms) stated overleaf or in the Special Conditions.</p><p>9. The Seller shall be obliged to appoint such carrier or carriers as may be specified or nominated by the Buyer for the transmission or delivery of the Goods to the Buyer.</p><p><b>Title and Risk</b><br/>10. Title to and risk in the Goods shall pass to the Buyer upon the delivery of the Goods to the Buyer except where the contrary is expressly or impliedly provided in the terms (including trade terms) stated overleaf or in the Special Conditions.</p><p><b>Inspection</b><br/>11. The Seller shall at the request of the Buyer procure that access is given to the Buyer to the Seller&#39;s premises or any other premises where the Goods are being manufactured in order for the Buyer to inspect, examine and test the unfinished Goods. The Seller shall further at the request of the Buyer allow the Buyer access to the Seller&#39;s premises and shall at the Seller&#39;s cost provide suitable facilities to enable the Buyer to inspect, examine and test the finished Goods prior to transmission to the Buyer.</p><p>12. Any inspection, examination or testing of the Goods carried out by the Buyer pursuant to paragraph 11 or otherwise shall not constitute acceptance of the Goods by the Buyer and the Buyer shall have the right to reject the Goods after the Buyer shall have had a reasonable opportunity of inspecting the Goods further to actual delivery and receipt of the Goods by the Buyer. The Seller shall further not be released in respect of any warranties and representations applicable to the Contract by reason of any inspection, examination or testing done by the Buyer.</p><p><b>Packing</b><br/>13. The Seller shall be responsible for the packing of the Goods and shall ensure that the packing in respect of the Goods shall conform with (a) the requirements of the Buyer set out overleaf or in the Special Conditions or otherwise to be specified at any time prior to delivery; (b) the best industrial practices due regard being given to the manner applicable laws and regulations, including but not limited to that port of origin and port of destination and (d) all safety requirements and practices.</p><p><b>Warranties</b><br/>14. The Goods shall comply in all respects with the description and specifications stated overleaf and any other written description and specifications of the Seller (contained in any advertisements, brochures, catalogues or otherwise issued to the Buyer) insofar as such description and specifications are not inconsistent with the Buyer&#39;s Order.</p><p>15. The Buyer shall be entitled at any time prior to delivery of the Goods of the Buyer to notify the Seller of any modifications or amendments which the Buyer requires to be made</p></td><td width="1%"> </td><td id="rightp"><p>in respect of any prior agreed specifications, provided that the modifications or amendments shall not significantly alter the fundamental nature and characteristics of the Goods to be supplied and provided further that the Buyer shall bear all reasonable cost and expenses incurred in connection with the same.</p><p>16. The Seller warrants that the Goods have been manufactured or prepared in accordance with all applicable laws and regulations and the best industrial standards with respect to product safety.</p><p>17. The Goods shall be of the best quality of its kind and the Seller warrants that the same shall at the time of delivery, and for the warranty period specified overleaf or in the Special Conditions (or where not so specified, then warranty period represented be the Seller in any quotation or otherwise) be free from all and any defects in workmanship and materials. Any warranty period applicable shall be taken only to commence as of the date when the respective Goods are first used by the Buyer. The Seller warrants that the Goods shall be fit for purpose in respect of which the Buyer intends or can be reasonably expected to have intention to use the Goods; regardless of whether such purpose has been made known to the Seller.</p><p>18. Where a sample of the Goods has been given to the Buyer, the Goods delivered to the Buyer shall conform in every respect insofar as the sample is not inconsistent with the specifications contained in the Buyer&#39;s Order.</p><p>19. The Seller warrants that the use possession dealing of the disposal of the Goods by the Buyer will not result in any infringement of the intellectual property rights of any third party.</p><p><b>Conflict of Interest</b><br/>20. The Seller shall exercise reasonable care diligence to prevent any action or condition during the currency of this contract which could result in a conflict of its interest with those of TPSC Asia Pte Ltd.</p><p><b>Miscellaneous</b><br/>21. The Buyer shall have the right to cancel the whole or any part of the Contract prior to delivery against payment by the Buyer of all reasonable costs and expenses incurred by Seller to date of cancellation in connection with the manufacture or preparation of the Goods.</p><p>22. The Buyer shall have the right to reject the Goods at any time prior to acceptance thereof by the Buyer. The Buyer shall further have the right (regardless of acceptance) to claim against the Seller for all damages, costs and expenses which may be suffered or incurred by the Buyer by reason of any act or default of the Seller on connection with Contract.</p><p>23. The Buyer shall be entitled to request for a replacement of the Goods or any part thereof during the applicable warranty period if the Goods do not otherwise comply with any of the warranties given by the Seller as to specifications, freedom from defects, quality and merchantability of fitness for purpose.</p><p>24. In the case where the Goods are to be delivered in instalments, the failure by the Seller to deliver any one or more of the instalments, or non-compliance with any one or more of the instalments with the Contract shall entitle the Buyer to treat the Contract repudiated as a whole.</p><p>25. Without prejudice to any of the other paragraph herein, the Seller shall indemnify the Buyer from all and any damages, costs, expenses, claims, demands or proceedings which may be suffered or incurred by, or asserted against the Buyer by reason of any act or default of the Seller under this Contract and / or all any defects (hidden or otherwise) in the Goods (including but not limited to such defects giving rise to third party liability). The indemnity shall apply regardless of whether title and / or risk to the Goods have passed to the Buyer.</p><p>26. No variation to the Buyer&#39;s Order and the Conditions herein shall be effective unless accept in writing by the authorised representatives of the Buyer, the authorised representatives of the Buyer to refer only to persons who are managerial or executive level.</p><p>27. Unless the context otherwise requires any term (or expression in particular trade terms) which have been used overleaf or in the Special Conditions and which is defined in or given a particular meaning by the provisions of Incoterms shall be likewise be given the same meaning for purposes of the Contract except to such extent that the provisions of Incoterms have been varied expressly or implicitly by paragraph 6, 7, 9, 11 to 25 hereof.</p><p><b>Confidentiality</b><br/>28. Each party hereto undertakes to keep all-commercial (Including, without limitations, prices, price adjustments and payment terms), financial and technical information provided to it by another party in strict confidence and not to disclose same to any 3rd party.</p><p><b>Loss Control</b><br/>29. The supplier has the responsibility to provide all relevant HSE information for his products/services supplied/rendered to TPSC Asia Pte Ltd.</p><p><b>Compliance and Integrity</b><br/>30. The parties represent and warrant that they shall perform this Contract in full compliance with the applicable laws of the country.</p></td></tr></table></body></pdf>';
}