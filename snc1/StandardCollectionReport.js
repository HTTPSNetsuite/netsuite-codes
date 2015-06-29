/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Mar 2015     Renandro Valparaiso
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */


function StandardCollectionReport(request, response) {
	if(request.getMethod() == 'GET') {
		var form = nlapiCreateForm('Standard Collection Report');
		form.addSubmitButton('Generate Report');
		form.addField('control_number', 'text', 'control number').setMandatory(true);
		form.addField('coll_date', 'date', 'date');//.setMandatory(true);
		form.addField('customer', 'select', 'customer', 'customer');
		form.addField('employee', 'select', 'employee', 'employee');//.setMandatory(true);
		form.addField('preparedby', 'select', 'Prepared By', 'employee')
			.setDisplayType('disabled')
			.setDefaultValue(nlapiGetUser());
		
		response.writePage(form);
	} else {
		var	html = nlapiGetContext().getSetting('SCRIPT', 'custscriptcollection_template');
		var customer = request.getParameter('customer');
		var employee = request.getParameter('employee');
		var collection_date = request.getParameter('coll_date');
		var ctrl_number = request.getParameter('control_number');
		var prepared_by = '';
		var approved_by = '';
		if(employee.length){
			prepared_by = nlapiLookupField('employee', employee, 'entityid', false);
		}
		
		html = html.replace('{ctrl_number}', ctrl_number);
		html = html.replace('{date}', collection_date);
		html = html.replace('{prepared_by}', prepared_by);		 
		var filters = [];
		if(customer.length) {
			filters.push(new nlobjSearchFilter('internalid', 'customer', 'is', customer));
		}
		if(collection_date.length) {
			filters.push(new nlobjSearchFilter('custbody4', null, 'on', collection_date));
		}
		if(employee.length) {
			filters.push(new nlobjSearchFilter('createdby', null, 'is', employee));
		}
		
		//response.writeLine('->'+customer+'<- , '+collection_date+' , '+employee+' , filter length: '+filters.length);
			 
		var collection = nlapiSearchRecord('customerpayment', 'customsearch_collectionreport_standard_7', filters, null);
		//response.writeLine((collection && collection.length)?collection.length:'No record!');
		
		var table = '';
		if(collection && collection.length) {
			var col_temp = collection[0].getAllColumns();
			var col = {};
			
			//Column Mapping
			col_temp.forEach(function(v, i, a) {
				switch (v.name) {
					case 'internalid':
							col['id'] = v;
					break;
					case 'custbody4':
							if(v.label == 'Collection Date') {
								col['coll_date'] = v;
							}
						break;
					case 'companyname':
							col['cust_name'] = v;
						break;
					case 'tranid':
							col['si'] = v;
						break;
					case 'custbody46':
							col['dr'] = v;
						break;
					case 'amount':
						if(v.label == 'Invoice Amount') {
							col['inv_amt'] = v;
						}
						if(v.label == 'Amount') {
							col['amt'] = v;
						}
					break;
					case 'transactionnumber':
						col['or'] = v;
					break;
					case 'custbody7':
						col['mpay_bank'] = v;
					break;
					case 'custbody5':
						col['mpay_pdccheck'] = v;
					break;
					case 'otherrefnum':
						col['mpay_checkno'] = v;
					break;
					case 'trandate':
						col['mpay_dateofcheck'] = v;
					break;
					case 'custbody30':
						col['salesman'] = v;
					break;
					case 'applyingtransaction':
						col['typeis'] = v;
					break;
					case 'statusref':
						col['statusref'] = v;
					break;
					case 'shipdate':
						col['shipdate'] = v;
					break;
					case 'paymentmethod':
						col['paymentmethod'] = v;
					break;
					case 'applyinglinkamount':
						col['cm_pm_amt'] = v;
					break;
					case 'amountpaid':
						col['amountpaid'] = v;
					break;
					default:
						break;
					}
			});
			
			var del_date = null;
			var date_depo = null;
			
			var current_or = null;
			var or_payment_method = {};
			
			var total_invoice = 0;
			var total_cm = 0;
			var total_dated_check = 0;
			var total_pdc_check = 0;
			var total_cash = 0;
		
			collection.forEach(function(collect, i, a) {
				var credit_memo = null;
				current_or = collect.getValue(col.or);
				current_payment_method = collect.getText(col.paymentmethod);
				
				if(current_payment_method.length > 0) {
					(or_payment_method[current_or])?null:or_payment_method[current_or]={};
					
					(or_payment_method[current_or]['payments'])?null:or_payment_method[current_or]['payments']={};
					
					or_payment_method[current_or]['paymentmethod'] = current_payment_method;
					or_payment_method[current_or]['amount'] = collect.getValue(col.amt);
				}
				
				//If Credit Memo
				if(collect.getText(col.typeis).indexOf('Journal') >= 0)
				{
					var current_payment = {
							'cust_name': collect.getValue(col.cust_name),
							'si': collect.getValue(col.si),
							'dr': dr,
							'del_date': (dr)?nlapiLookupField('itemfulfillment',collect.getValue(col.dr), 'trandate'):null,
							'inv_amt': collect.getValue(col.inv_amt),
							'dmcm_sym': 'JE',
							'dmcm_amt': collect.getValue(col.cm_pm_amt),
							'or':collect.getValue(col.or),
							'mpay_bank':collect.getValue(col.mpay_bank),
							'mpay_checkno':collect.getValue(col.mpay_checkno),
							'mpay_dateofcheck':collect.getValue(col.mpay_dateofcheck),
							'mpay_datedcheck':null,
							'mpay_pdccheck':null,
							'mpay_cash':null,
							'date_depo':null,
							'amountpaid': collect.getValue(col.amountpaid),
							'salesman':collect.getValue(col.salesman),	
					};
					(or_payment_method[current_or]['payments'][current_payment.si])?null:or_payment_method[current_or]['payments'][current_payment.si]={};
					(or_payment_method[current_or]['payments'][current_payment.si]['journalentry'])?null:or_payment_method[current_or]['payments'][current_payment.si]['journalentry'] = [];
					or_payment_method[current_or]['payments'][current_payment.si]['journalentry'].push(current_payment);
				}
				
				
				//If Credit Memo
				if(collect.getText(col.typeis).indexOf('Credit Memo') >= 0)
				{
					date_depo = collect.getText(col.statusref);
					credit_memo = collect.getText(col.typeis);
					credit_memo = credit_memo.split('#')[1];
					
					var filters = [];
					filters.push(new nlobjSearchFilter('tranid', null, 'is', credit_memo));
					var cms = nlapiSearchRecord('creditmemo', 'customsearch389', filters, null);
										
					var is_pdc = collect.getValue(col.mpay_pdccheck);
					if(cms && cms.length) {
						cms.forEach(function(v, i , a) {
							var dr = (collect.getText(col.dr))?collect.getText(col.dr).split('#')[1]:null;
							var sym = v.getText('custitem3', 'item');
							//response.writeLine('CREDITMEMO  ='+credit_memo+' AMOUNT = '+v.getValue('total', null));
									
							var current_payment = {'coll_date': collect.getValue(col.coll_date),
									'cust_name': collect.getValue(col.cust_name),
									'si': collect.getValue(col.si),
									'dr': dr,
									'del_date': (dr)?nlapiLookupField('itemfulfillment',collect.getValue(col.dr), 'trandate'):null,
									'inv_amt': collect.getValue(col.inv_amt),
									'dmcm_sym': (sym.length>0)?sym:'ewt',
									'dmcm_amt':v.getValue('total', null),
									'or':collect.getValue(col.or),
									'mpay_bank':collect.getValue(col.mpay_bank),
									'mpay_checkno':collect.getValue(col.mpay_checkno),
									'mpay_dateofcheck':collect.getValue(col.mpay_dateofcheck),
									'mpay_datedcheck':null,
									'mpay_pdccheck':null,
									'mpay_cash':null,
									'date_depo':null,
									'amountpaid': collect.getValue(col.amountpaid),
									'salesman':collect.getValue(col.salesman),
									};
							current_payment['type'] = 'credit memo';
							(or_payment_method[current_or]['payments'])?null:or_payment_method[current_or]['payments']={}; 
							(or_payment_method[current_or]['payments'][current_payment.si])?null:or_payment_method[current_or]['payments'][current_payment.si]={};
							(or_payment_method[current_or]['payments'][current_payment.si]['creditmemo'])?null:or_payment_method[current_or]['payments'][current_payment.si]['creditmemo']=[];
							
							
							if(is_pdc && is_pdc.toLowerCase() == 't') {
								current_payment['mpay_pdccheck'] = addCommas(collect.getValue(col.amountpaid));
								
							}
							
							if(is_pdc &&
										is_pdc.toLowerCase() == 'f' &&
										or_payment_method[current_or] &&
										or_payment_method[current_or]['paymentmethod'].toLowerCase() == 'check' ) {
								current_payment['mpay_datedcheck'] = addCommas(collect.getValue(col.amountpaid));
							}
							
							if(is_pdc && is_pdc.toLowerCase() == 'f' &&
									or_payment_method[current_or] &&
									or_payment_method[current_or]['paymentmethod'].toLowerCase() != 'check') {
								current_payment['mpay_cash'] = addCommas(collect.getValue(col.amountpaid));
							}
							
							//table+= AddRow(current_payment);
							or_payment_method[current_or]['payments'][current_payment.si]['creditmemo'].push(current_payment);
							//response.writeLine('CREDITMEMO si= '+collect.getValue(col.si)+' ,current_or= '+current_or+ ', type= '+or_payment_method[current_or]['paymentmethod']+', amount= '+collect.getValue(col.cm_pm_amt));
						});
					}
				} 
				
				//Payment
				if(collect.getText(col.typeis).indexOf('Payment') >= 0)
				{	
					var date_depo = collect.getText(col.statusref);
					var is_pdc = collect.getValue(col.mpay_pdccheck);
					var dr = (collect.getText(col.dr))?collect.getText(col.dr).split('#')[1]:null;
					var current_payment = {'coll_date': collect.getValue(col.coll_date),
							'payment_name': collect.getText(col.typeis),
							'cust_name': collect.getValue(col.cust_name),
							'si': collect.getValue(col.si),
							'dr': dr,
							'del_date': (dr)?nlapiLookupField('itemfulfillment',collect.getValue(col.dr), 'trandate'):null,
							'inv_amt': collect.getValue(col.inv_amt),
							'dmcm_sym': null,
							'dmcm_amt': collect.getValue(col.cm_pm_amt),
							'or':collect.getValue(col.or),
							'mpay_bank':collect.getValue(col.mpay_bank),
							'mpay_checkno':collect.getValue(col.mpay_checkno),
							'mpay_dateofcheck':collect.getValue(col.mpay_dateofcheck),
							'mpay_datedcheck':0,
							'mpay_pdccheck':0,
							'mpay_cash':0,
							'date_depo':date_depo,
							'amountpaid': collect.getValue(col.amountpaid),
							'salesman':collect.getValue(col.salesman) };
					
					(or_payment_method[current_or]['payments'][current_payment.si])?null:or_payment_method[current_or]['payments'][current_payment.si]={};
					(or_payment_method[current_or]['payments'][current_payment.si]['payments'])?null:or_payment_method[current_or]['payments'][current_payment.si]['payments']=[];
					
					if(is_pdc && is_pdc.toLowerCase() == 't') {
						current_payment['mpay_pdccheck'] = or_payment_method[current_or]['amount'];//collect.getValue(col.amountpaid);
					}
					
					if(is_pdc &&
								is_pdc.toLowerCase() == 'f' &&
								or_payment_method[current_or] &&
								or_payment_method[current_or]['paymentmethod'].toLowerCase() == 'check' ) {
						current_payment['mpay_datedcheck'] = or_payment_method[current_or]['amount'];//collect.getValue(col.amountpaid);
					}
					
					if(is_pdc && is_pdc.toLowerCase() == 'f' &&
							or_payment_method[current_or] &&
							or_payment_method[current_or]['paymentmethod'].toLowerCase() != 'check') {
						current_payment['mpay_cash'] = or_payment_method[current_or]['amount'];//collect.getValue(col.amountpaid);
						current_payment['mpay_bank'] = null;
						current_payment['mpay_checkno'] = null;
						current_payment['mpay_dateofcheck'] = null;
					}
					
					current_payment['type'] = 'payment';
					//if(collect.getText(col.typeis).split('#')[1] != current_or)
					//{
						or_payment_method[current_or]['payments'][current_payment.si]['payments'].push(current_payment);
					//}
					
					//table+= AddRow(current_payment);					
					//response.write(JSON.stringify(current_payment));
					//response.writeLine('si= '+collect.getValue(col.si)+' , pdc= '+is_pdc+' , current_or= '+current_or+ ', type= '+ or_payment_method[current_or]['paymentmethod']+', amount= '+collect.getValue(col.cm_pm_amt));
				}
			
			});
			//response.writeLine(or_payment_method);
			//html = html.replace('{table}', table);		
		
		Object.keys(or_payment_method).forEach(function(or, i, a) { // PER OR
			var per_or = {};
			per_or['invoices'] = {};
			var last_si = Object.keys(or_payment_method[or]['payments'])[Object.keys(or_payment_method[or]['payments']).length-1];
			var with_cm = {
					'exist':false,
					'count':0
				};
			var with_payment = {
					'exist':false,
					'count':0
				};
			
			var processed_payments = 0;
			
			Object.keys(or_payment_method[or]['payments']).forEach(function(si, i1, a1) { //PER SI
				//if(per_or['invoices'][or])
				per_or['invoices'][si] = {};
				per_or['invoices'][si]['cm'] = 0;
				per_or['invoices'][si]['payments'] = 0;
				
				//GET CREDIT MEMO PER SI/ PER OR
				if(Object.keys(or_payment_method[or]['payments'][si]).indexOf('creditmemo') >= 0) {
					with_cm.exist = true;
					per_or['invoices'][si]['cm']+=or_payment_method[or]['payments'][si]['creditmemo'].length;
					with_cm.count+=per_or['invoices'][si]['cm'];
				}
				//GET PAYMENT PER SI/ PER OR
				if(Object.keys(or_payment_method[or]['payments'][si]).indexOf('payments') >= 0) {
					with_payment.exist = true;
					per_or['invoices'][si]['payments']+=or_payment_method[or]['payments'][si]['payments'].length;
					with_payment.count+=per_or['invoices'][si]['payments'];
				}
			});
			
			
			Object.keys(or_payment_method[or]['payments']).forEach(function(si, i1, a1) { //PER INVOICE
					if(or_payment_method[or]['payments'][si]['creditmemo']) {
						//credit memo per si
						or_payment_method[or]['payments'][si]['creditmemo'].forEach(function(cm, i2, a) {
							//IF NOT EQUAL TO LAST CM
							if(i2 < (or_payment_method[or]['payments'][si]['creditmemo'].length)-1) {
								cm.or = null;
								cm.mpay_datedcheck = null;
								cm.mpay_pdccheck = null;
								cm.mpay_cash = null;
								cm.salesman = null;
								cm.mpay_bank = null;
								cm.mpay_checkno = null;
								cm.mpay_dateofcheck = null;
								if(with_payment.count>1) {
									cm.coll_date = null;
									cm.cust_name = null;
								}
								if(i2 != 0 ) {
									cm.coll_date = null;
									cm.cust_name = null;
									cm.si =null;
									cm.dr = null;
									cm.del_date = null;
									cm.inv_amt = null; 				
								}
								total_cm+=parseFloatOrZero(cm.dmcm_amt); 
								table+= AddRow(cm);
							}  
							//IF EQUAL TO THE LAST CM
							if(i2 == or_payment_method[or]['payments'][si]['creditmemo'].length-1) {
								
								//JE Processing
								if(or_payment_method[or]['payments'][si]['journalentry']) {
									if(or_payment_method[or]['payments'][si]['journalentry'].length == 1) {
										var je = or_payment_method[or]['payments'][si]['journalentry'][0];
										total_cm+=parseFloatOrZero(je.dmcm_amt);
										
										Object.keys(je).forEach(function(v, i, a) {
											switch (v) {
											case 'dmcm_sym':
												break;
											case 'dmcm_amt':
												break;
											default:
												je[v] = null;
												break;
											}										
										});
										
										table+= AddRow(je);
									} else {
										or_payment_method[or]['payments'][si]['journalentry'].forEach(function(je, i, a) {
											total_cm+=parseFloatOrZero(je.dmcm_amt);
											var je = je;
											Object.keys(je).forEach(function(v, i, a) {
												switch (v) {
												case 'dmcm_sym':
													break;
												case 'dmcm_amt':
													break;
												default:
													je[v] = null;
													break;
												}										
											});
											table+= AddRow(je);
										});
									}
								}
								
								if(or_payment_method[or]['payments'][si]['payments'].length > 1) { //IF many payments
									//Get all payments except last
									or_payment_method[or]['payments'][si]['payments'].slice(0, or_payment_method[or]['payments'][si]['payments'].length-1)
									.forEach(function(p1, i1, a1) {
										processed_payments+=1;
										total_cm+=parseFloatOrZero(p1.dmcm_amt);
										p1.coll_date = null;
										p1.cust_name = null;
										p1.si =null;
										p1.dr = null;
										p1.del_date = null;
										p1.inv_amt = null;
										p1.mpay_datedcheck = null;
										p1.or = null;
										p1.mpay_bank = null;
										p1.mpay_dateofcheck = null;
										p1.mpay_checkno = null;
										p1.mpay_pdccheck = null;
										p1.mpay_cash = null;
										p1.salesman = null;
										p1.date_depo = null;
										
										//Show if dmcm applied payment
										if(p1.payment_name.split('#')[1] == or){
											p1.dmcm_sym = null;
											p1.dmcm_amt = null;
										} else {
											p.dmcm_sym = 'PAY';
										}
										
										table+= AddRow(p1); 
									});
									
									//Last payment
									var plength = or_payment_method[or]['payments'][si]['payments'].length-1;
									var p = or_payment_method[or]['payments'][si]['payments'][plength];
									
									if(or_payment_method[or]['payments'][si]['creditmemo'].length > 1) {
										p.coll_date = null;
										p.cust_name = null;
										p.si =null;
										p.dr = null;
										p.del_date = null;
										p.inv_amt = null;
									}
									
									if(p1.payment_name.split('#')[1] == or){
										p1.dmcm_sym = null;
										p1.dmcm_amt = null;
									} else {
										p.dmcm_sym = 'PAY';
									}
									p.mpay_datedcheck = (p.mpay_datedcheck)?p.mpay_datedcheck:null;
									p.mpay_pdccheck = (p.mpay_pdccheck)?p.mpay_pdccheck:null;
									p.mpay_cash = (p.mpay_cash)?p.mpay_cash:null;
									
									if(processed_payments != with_payment.count) {
										p.or = null;
										p.mpay_bank = null;
										p.mpay_dateofcheck = null;
										p.mpay_checkno = null;
										p.mpay_pdccheck = null;
										p.mpay_cash = null;
										p.salesman = null;
										p.date_depo = null;
										p.mpay_datedcheck = null;
									} 
									
									if(si!=last_si){
										p.mpay_cash = null;
										p.or = null;
										p.date_depo = null;
										p.salesman = null;
										p.mpay_datedcheck = null;
										p.mpay_pdccheck = null;
										p.mpay_dateofcheck = null;
										p.mpay_bank = null;
										p.mpay_checkno = null;
									}
									
									total_invoice+=parseFloatOrZero(p.inv_amt);
									total_dated_check+=parseFloatOrZero(p.mpay_datedcheck);
									total_pdc_check+=parseFloatOrZero(p.mpay_pdccheck);
									total_cash+=parseFloatOrZero(p.mpay_cash);
									total_cm+=parseFloatOrZero(p.dmcm_amt); 
									table+= AddRow(p); 
									
								} else { // single payments
									
									or_payment_method[or]['payments'][si]['payments'].forEach(function(p, i1, a1) {
										 
										if(or_payment_method[or]['payments'][si]['creditmemo'].length > 1) {
											p.coll_date = null;
											p.cust_name = null;
											p.si =null;
											p.dr = null;
											p.del_date = null;
											p.inv_amt = null;
										}
										//p.dmcm_sym = p.dmcm_sym,
										//p.dmcm_amt = null;
										if(p.payment_name.split('#')[1] == or){
											p.dmcm_sym = null;
											p.dmcm_amt = null;
										} else {
											p.dmcm_sym = 'PAY';
										}
										p.mpay_datedcheck = (p.mpay_datedcheck)?p.mpay_datedcheck:null;
										p.mpay_pdccheck = (p.mpay_pdccheck)?p.mpay_pdccheck:null;
										p.mpay_cash = (p.mpay_cash)?p.mpay_cash:null;
										
										if(si!=last_si){
											p.mpay_cash = null;
											p.or = null;
											p.date_depo = null;
											p.salesman = null;
											p.mpay_datedcheck = null;
											p.mpay_pdccheck = null;
											p.mpay_dateofcheck = null;
											p.mpay_bank = null;
											p.mpay_checkno = null;
										}
										
										total_invoice+=parseFloatOrZero(p.inv_amt);
										total_dated_check+=parseFloatOrZero(p.mpay_datedcheck);
										total_pdc_check+=parseFloatOrZero(p.mpay_pdccheck);
										total_cash+=parseFloatOrZero(p.mpay_cash);
										total_cm+=parseFloatOrZero(p.dmcm_amt);
										
										table+= AddRow(p); 
									});
								}
							};
						
						});
					}
					
					//Invoice with no credit memo
					if(!per_or['invoices'][si]['cm']) {
						or_payment_method[or]['payments'][si]['payments'].forEach(function(p, i, a) {
							//if(with_payment.count > 1) {
								//Applied Payment
								if(p.payment_name.split('#')[1] == or) {
									p.dmcm_sym = null;
									p.dmcm_amt = null;
								} else {
									p.dmcm_sym = 'PAY';
								}
								
								//NOT EQUAL TO THE LAST OF PAYMENTS
								if(i!= or_payment_method[or]['payments'][si]['payments'].length-1) {
									p.si =null;
									p.dr = null;
									p.del_date = null;
									p.inv_amt = null;
									
								}
								
								//Current si not equal to the last si
								if(si!=last_si){
									p.mpay_cash = null;
									p.or = null;
									p.date_depo = null;
									p.salesman = null;
									p.mpay_datedcheck = null;
									p.mpay_pdccheck = null;
									p.mpay_dateofcheck = null;
									p.mpay_bank = null;
									p.mpay_checkno = null;
									
								}
								
								//if si is first
								if(si != Object.keys(or_payment_method[or]['payments'])[0]) {
									p.coll_date = null;
									p.cust_name = null;
								}
								
								//JE Processing
								if(or_payment_method[or]['payments'][si]['journalentry']) {
									if(or_payment_method[or]['payments'][si]['journalentry'].length == 1) {
										var je = or_payment_method[or]['payments'][si]['journalentry'][0];
										total_cm+=parseFloatOrZero(je.dmcm_amt);
										
										Object.keys(je).forEach(function(v, i, a) {
											switch (v) {
											case 'dmcm_sym':
												break;
											case 'dmcm_amt':
												break;
											default:
												je[v] = null;
												break;
											}										
										});
										
										table+= AddRow(je);
									} else {
										or_payment_method[or]['payments'][si]['journalentry'].forEach(function(je, i, a) {
											total_cm+=parseFloatOrZero(je.dmcm_amt);
											var je = je;
											Object.keys(je).forEach(function(v, i, a) {
												switch (v) {
												case 'dmcm_sym':
													break;
												case 'dmcm_amt':
													break;
												default:
													je[v] = null;
													break;
												}										
											});
											table+= AddRow(je);
										});
									}
								}
								
								total_cm+=parseFloatOrZero(p.dmcm_amt);
								total_invoice+=parseFloatOrZero(p.inv_amt);
								total_dated_check+=parseFloatOrZero(p.mpay_datedcheck);
								total_pdc_check+=parseFloatOrZero(p.mpay_pdccheck);
								total_cash+=parseFloatOrZero(p.mpay_cash);
								table+= AddRow(p);
							//}
						});
					}
					
				});
			
		});
		
		//response.write(JSON.stringify(or_payment_method));	
		
		table+='<tr>';
		table+='<td colspan="5" align="right"><strong>TOTAL</strong></td><td align="right">'+numeric(Math.round10(total_invoice), -2)+'</td>';
		table+='<td></td><td align="right">'+numeric(Math.round10(total_cm), -2)+'</td>';//CM AMOUNT
		table+='<td colspan="4"></td><td align="right">'+numeric(Math.round10(total_dated_check), -2)+'</td>';//DATED CHECK
		table+='<td align="right">'+numeric(Math.round10(total_pdc_check), -2)+'</td><td align="right">'+numeric(Math.round10(total_cash), -2)+'</td>';//PDC CHECK & CASH
		table+='</tr>';
		
		html = html.replace('{table}', table);
		var file = nlapiXMLToPDF(html); 
		//response.write(table);
		
		response.setContentType('PDF', 'std_collection.pdf', 'inline');
		response.write(file.getValue()); 
		
		} else {
			var form = nlapiCreateForm('Standard Collection Report');
			form.addField('message', 'inlinehtml').setDefaultValue('<h1 style="font-size: 25px;">No Record!</h1>');
			form.addButton('back', 'Back', 'window.history.back();');
			response.writePage(form);
			//response.writeLine('No Record!');
		}
	}
};

function parseFloatOrZero(b){var a=parseFloat(b);return isNaN(a)?0:a;}

function AddRow(collect) {
	return	"<tr>"+
			"<td class='contenttable1'>" + emptyChecks(collect.coll_date) + "</td>" +
			"<td class='contenttable1'>" + emptyChecks(collect.cust_name) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.si) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.dr) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.del_date) + "</td>" +
			"<td class='contenttable1' align='right'>" + emptyChecks(addCommas(collect.inv_amt)) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.dmcm_sym) + "</td>" +
			"<td class='contenttable1' align='right'>" + emptyChecks(addCommas(collect.dmcm_amt)) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.or) + "</td>" +
			"<td class='contenttable1' align='left'>" + emptyChecks(collect.mpay_bank) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.mpay_checkno) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.mpay_dateofcheck) + "</td>" +
			"<td class='contenttable1' align='right'>" + emptyChecks(addCommas(collect.mpay_datedcheck)) + "</td>" +
			"<td class='contenttable1' align='right'>" + emptyChecks(addCommas(collect.mpay_pdccheck)) + "</td>" +
			"<td class='contenttable1' align='right'>" + emptyChecks(addCommas(collect.mpay_cash)) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.date_depo) + "</td>" +
			"<td class='contenttable1' align='center'>" + emptyChecks(collect.salesman) + "</td>" +
			"</tr>";
}

function parseFloatOrZero(b){var a=parseFloat(b);return isNaN(a)?0:a;}

function emptyChecks(value) {
	return (value)?'<![CDATA['+value+']]>':'';
}

function addCommas(number) {
	if(number == 0) {
		return null;
	}
    if (number != null) {
        parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        number = parts.join('.');
        return number;
    } else {
        return number;
    }
}
