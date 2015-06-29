function calcProjectVal() {
	if(nlapiGetRecordId() === '') return;
	var loadRec = nlapiLoadRecord('job', nlapiGetRecordId());
	if(nlapiGetFieldValue('calculatedenddate') === '') return;
	var endDate = loadRec.getFieldValue('calculatedenddate');
	var dateSplit = endDate.split('/');
	var newDate = new Date(dateSplit[2], dateSplit[0], dateSplit[1]);
	nlapiSubmitField('job', nlapiGetRecordId(), 'custentity_project_validity', ((newDate.getMonth()+1) + '/'+ newDate.getDate() + '/' + newDate.getFullYear()));
	//loadRec.setFieldValue('custentity_project_validity', ((newDate.getMonth()+1) + '/'+ newDate.getDate() + '/' + newDate.getFullYear()));
	//loadRec.setFieldValue('custentity_project_validity', ((newDate.getMonth()+1) + '/'+ newDate.getDate() + '/' + newDate.getFullYear()));
	//document.getElementById('custentity_project_validity').value = ((newDate.getMonth()+1) + '/'+ newDate.getDate() + '/' + newDate.getFullYear());
}	