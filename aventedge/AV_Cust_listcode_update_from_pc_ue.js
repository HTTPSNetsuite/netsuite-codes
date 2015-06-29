function afterSubmitPC(type)
{

if ((type.toLowerCase() == 'create') || (type.toLowerCase() == 'edit'))
{

var newRecord = nlapiGetNewRecord();
var pc_customer = newRecord.getFieldValue('custrecord_cust_name');
var pc_listcode = newRecord.getFieldValue('custrecord_list_code');

if (pc_customer)
	{
	var cust_listcode = nlapiLookupField('customer', pc_customer, 'custentity4');
	if (!cust_listcode)
		nlapiSubmitField('customer', pc_customer, 'custentity4', pc_listcode);
		

	}
		
}
	
} 