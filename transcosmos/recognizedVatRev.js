function recognizedVatRev(param1, param2, param3) {
	if(param1 !== 'apply' && param2 !== 'apply') return;
	var a = document.getElementById('apply_splits');
	var tr = document.getElementById('apply_splits').getElementsByTagName('tr');
	var total = 0;
	var new_array = [];
	for(var i = 1; i <= tr.length-1; i++) {
		var tds = a.rows[i].getElementsByTagName('td');
		//we have to do it one by one so that there are no mis conception and para mas madaling basahin
		//get the value of 12th td
		var tdnum = tds[12].innerHTML;
		//replace the comma created by netsuite
		tdnum = tdnum.replace(/,/g, '');
		//replace also the .00 at the last or the decimal
		tdnum = tdnum.replace('.00', '');
		//validate if it really contains something
		tdnum = (tdnum === '&nbsp;' || tdnum === '') ? 0: tdnum;
		//console.log('trythis tdnum = ' + tdnum);

		//same as through with the 12th td we get the value of amount or the custom field we created to display the value
		var num = document.getElementById('amount' + i).value;
		//replace the commas
		num = num.replace(/,/g, '');
		//then replace the .00
		num = num.replace('.00', '');
		//then validate if it really contains something
		num = (num === '') ? 0: num; //this is the payment
		//console.log('num' + num);

		//decide if what to get 'payment or total amount'
		var vamount = (tdnum === 0) ? (num / 112)*100: (tdnum / 112)*100;
		//console.log('break' + vamount);
		var loadRec = nlapiLoadRecord('invoice', nlapiGetLineItemValue(param1, 'internalid', param3));
		var isvat = parseInt(loadRec.getLineItemValue('item', 'taxrate1', 1));
		/*console.log("tdnum " + tdnum);
		console.log("num " + num);
		console.log("vamount " + vamount);
		console.log("isvat " + isvat);*/
		vamount = (vamount * (isvat / 100));
		//console.log('vat amount = ' + vamount);
		total += vamount;
		var new_var = (tdnum === 0) ? num:tdnum; //hmmm kagaya nung sa taas pero para mas malinaw gawa na lang tayu ng ibang variable
		new_array.push(new_var);
	}
	document.getElementsByName('custbody_net_of_wtax')[0].value = new_array;
	document.getElementsByName('custbody_recognized_vat')[0].value = AddCommas(total.toFixed(2));
	total = 0;
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
