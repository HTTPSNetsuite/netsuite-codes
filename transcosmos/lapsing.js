	function lapsing(request, response) {
		if(request.getMethod() === 'GET') {
			form = nlapiCreateForm('Fixed Asset Schedule');
			form.addField('start_date', 'date', 'Start Date');
			form.addField('end_date', 'date', 'End Date');

			form.addSubmitButton('Submit');
			response.writePage(form);
		} else {
			/*
			I decided not to use netsuite params on this even though there i defined one at the begining because I think there is no need to use parameters 
			if you can do it in code and the string replacement that we are using is somewhat slow so we just do this all here so

			Also on the part where I tried to loop all the results, I decided not to search record kasi mas mahaba yung process although pwede rin
			*/

			//initialized all fields being submitted
			var start_date = request.getParameter('start_date');
			var end_date = request.getParameter('end_date');

			//formulate filter on query so we say
			var where = [new nlobjSearchFilter('trandate', null, 'within', start_date, end_date)];
			var ret = []; //we just want to return all the result after all, i think this object is useless

			var qry = nlapiSearchRecord(null, 'customsearch_bills_for_ppe', where, ret); //query from this save search
			var loadPPE = nlapiSearchRecord(null, 'customsearch_ppe_details'); //load all the records on this save search
			var loadDep = nlapiSearchRecord(null, 'customsearch86'); //load all the records on this save search

			if(qry === null) return;
			//formulate the html format and the table format
			var html = '<html><title>Fixed Asset Schedule</title>'+
						'<style>'+
							'td { padding: 3px 5px; margin: 0 !important}' +
							'th { font-weight; bold !important; padding: 3px 5px; font-size: 16px; text-align: center !important; }' +
							'tr:last-child { padding-top: 30px !important;}'+ 
							'tr>td.first { border-bottom: 1px solid; }' +
							'tr.tds > td { border-right: 1px solid; text-align: right;} '+
						'</style>'+
						'<table style = "width: 100%;">';
			html += '<thead>'+
						'<tr><th>Asset Type</th>'+
						'<th>Asset Name</th>'+
						'<th>Description</th>'+
						'<th>Aquisition Date</th>'+
						'<th width = 300>'+
							'<table width = "100%">'+
							'<tr><th align = "center" colspan = 4>Cost<th></tr>'+
							'<tr><th>'+start_date+'<th>'+
							'<th>Additions</th>'+
							'<th>'+end_date+'</th></tr></table></th>'+
						'<th width = 300>'+
							'<table width = "100%">'+
								'<tr><th align = "center" colspan = 3>Accumulated Depreciation</th></tr>'+
								'<tr><th>'+start_date+'</th>'+
								'<th>Depreciation</th>'+
								'<th>'+end_date+'</th></tr>'+
							'</table>'+
						'</th>'+
						'<th width = 200>'+
							'<table width = "100%">'+
								'<tr><th align = "center" colspan = 3>NBV</th></tr>'+
								'<tr><th>'+start_date+'</th>'+
								'<th>'+end_date+'</th>'+
							'</table>'+
						'</th>'+ 
					'</thead>';
			var form_result = nlapiCreateForm('Fixed Asset Schedule');
			var start_date_toTime = new Date(start_date).getTime();
			var end_date_toTime = new Date(end_date).getTime();
			var total_date1 = 0, total_date2 = 0, total_date3 = 0, total_date4 = 0, total_date5 = 0, total_date6 = 0;
			var total1 = 0, total2 = 0, total3 = 0, total4 = 0, total5 = 0, total6 = 0;
			var grandtotal1 = 0, grandtotal2 = 0, grandtotal3 = 0, grandtotal4 = 0, grandtotal5 = 0, grandtotal6 = 0;
			var lastNum = '';

			for(var counter = 0; counter < qry.length; counter++) {
				var itemid = qry[counter].getText('item');
				//validate if the current itemid record matches on the loaded record
				var validate = false;
				var objectIndex = '';
						

				var totaldep1 = 0;
				var totaldep2 = 0;
				if(loadPPE !== null) { 
					for(var i = 0; i < loadPPE.length; i++) {					
						if(loadPPE[i].getValue('itemid') === itemid) {
							validate = true;
							objectIndex = i;
							break;
						}
					}					
				}

				if(loadDep !== null) {
					for(var y = 0; y < loadDep.length; y++) {
						var trandate = loadDep[y].getValue('trandate');
						var dateToTime = new Date(trandate).getTime();
						if((loadDep[y].getText('custcol_asset_name') === itemid) && dateToTime < start_date_toTime) {
							totaldep1 += parseInt(loadDep[y].getValue('amount'));
						} else if((loadDep[y].getText('custcol_asset_name') === itemid) && ((dateToTime >= start_date_toTime) && (dateToTime <= end_date_toTime))) {
							totaldep2 += parseInt(loadDep[y].getValue('amount'));
						}
					}
				}
				

				if(validate === true) {
					//get all the values
					var asset_type = loadPPE[objectIndex].getValue('custitem_asset_category');
					var asset_name = loadPPE[objectIndex].getValue('itemid');
					var description = loadPPE[objectIndex].getValue('custitem_model');
					var aquisition_date = qry[counter].getValue('trandate');
					var date_1 = qry[counter].getValue('amount');
					var newobjectIndex = 0;
					//we will get the next asset type
					for(var c = counter+1; c<qry.length; c++) {
						var itemid2 = qry[c].getText('item');
						if(newobjectIndex !== 0) {
							break;
						} else { 
							for(var z = 0; z < loadPPE.length; z++) {
								if(loadPPE[z].getValue('itemid') === itemid2) {
									newobjectIndex = z;
									break;
								}
							}
						}
					}
					
					total2 += totaldep1;
					total3 += totaldep2;

					nextNum = (newobjectIndex === 0) ? 0:loadPPE[newobjectIndex].getValue('custitem_asset_category');					
					if(lastNum === nextNum) {
						total1 += parseInt(date_1);
						html += makeFromRow(asset_type, asset_name, description, aquisition_date, date_1, '0.00', date_1, totaldep1, totaldep2, (totaldep1 + totaldep2), (parseInt(date_1)-totaldep1), (parseInt(date_1) - totaldep2));
					} else {
						total1 += parseInt(date_1);
						total4 += total2 + total3;
						total5 += (total1 - total2);
						total6 += (total1 - total3);

						html += makeFromRow(asset_type, asset_name, description, aquisition_date, date_1, '0.00', date_1, totaldep1, totaldep2, (totaldep1 + totaldep2), (parseInt(date_1)-totaldep1), (parseInt(date_1) - totaldep2));
						html += makeFromRow('', '', '', asset_type + ' Total', total1, '0.00', total1, total2, total3, total4, total5, total6);
						grandtotal1 += total1, grandtotal2 += total2, grandtotal3 += total3, grandtotal4 += total4, grandtotal5 += total5, grandtotal6 += total6;
						total1 = 0, total2 = 0, total3 = 0, total4 = 0, total5 = 0, total6 = 0;						
					}
					lastNum = nextNum;	
					
						
				} 
				total_date1 += parseInt(qry[counter].getValue('amount'));
			}

			html += '<tr style = "margin-top: 20px">'+
							'<td colspan = "4" align = "right">Grand Total</td>'+
							'<td width = 300>'+
								'<table width = "100%">'+
									'<tr class = "tds"><td width = 100>'+AddCommas(grandtotal1)+'</td><td width = 100>0.00</td><td width = 100>'+AddCommas(grandtotal1)+'</td></tr>'+
								'</table>'+
							'</td>'+
							'<td width = 300>'+
								'<table width = "100%">'+
									'<tr class = "tds"><td width = 100>'+AddCommas(grandtotal2)+'</td><td width = 100>'+AddCommas(grandtotal3)+'</td><td width = 100>'+AddCommas(grandtotal4)+'</td></tr>'+
								'</table>'+
							'</td>'+
							'<td width = 300>'+
								'<table width = "100%">'+
									'<tr class = "tds"><td width = 150>'+AddCommas(grandtotal5)+'</td><td width = 150>'+AddCommas(grandtotal6)+'</td></tr>'+
								'</table>'+
							'</td>'+
				       	'</tr>';

			html += '</table></html>';
			form_result.addField('html', 'inlinehtml', null, null, 'primary').setDefaultValue(html);
	      	response.writePage(form_result);

		}
	}

	function makeFromRow(asset_type, asset_name, description, aquisition_date, date_1, cost, date_2, date_3, depreciation, date_4, date_5, date_6) {
		return '<tr>'+
					'<td class = "first">'+asset_type+'</td>'+
					'<td class = "first">'+asset_name+'</td>'+
					'<td class = "first">'+description+'</td>'+
					'<td class = "first">'+aquisition_date+'</td>'+
					'<td width = 300 class = "first">'+
						'<table width = "100%">'+
							'<tr class = "tds"><td width = 100>'+AddCommas(date_1)+'</td><td width = 100>'+AddCommas(cost)+'</td><td width = 100>'+AddCommas(date_2)+'</td></tr>'+
						'</table>'+
					'</td>'+
					'<td width = 300 class = "first">'+
						'<table width = "100%">'+
							'<tr class = "tds"><td width = 100>'+AddCommas(date_3)+'</td><td width = 100>'+AddCommas(depreciation)+'</td><td width = 100>'+AddCommas(date_4)+'</td></tr>'+
						'</table>'+
					'</td>'+
					'<td width = 300 class = "first">'+
						'<table width = "100%">'+
							'<tr class = "tds"><td width = 150>'+AddCommas(date_5)+'</td><td width = 150>'+AddCommas(date_6)+'</td></tr>'+
						'</table>'+
					'</td>'+
		       	'</tr>';
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
