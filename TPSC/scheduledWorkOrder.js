/*
 *Author: HTTP
 *Note: This code snippet is scheduled that will run by the server itself, 
 *It will create Work Order automatically based on the created Preventive Maintenance Plan that 
 *was scheduled today or now... 
 *this will run base on the scheduled time set on the deployment of this script and will be deployed with a status of Scheduled
 *Any change on the PO behavior will affect the functionality of this code.
 *Date Written: 05/22/2015
*/

function scheduledWorkOrder(type) {
	var qry = nlapiSearchRecord(null, 'customsearch78', null, null);
	if(qry == null) return;
	for(var counter = 0; counter < qry.length; counter++) {
		var loadRec = nlapiLoadRecord('customrecord_preventive_maintenance_plan', qry[counter].getId());
		var create_record = nlapiCreateRecord('customrecord300'); //create new record
		//sets all the necessary record
		create_record.setFieldValue('custrecord153', loadRec.getFieldValue('custrecord168'));
		create_record.setFieldValue('name', loadRec.getFieldValue('name'));
		create_record.setFieldValue('altname', loadRec.getFieldValue('altname'));
		create_record.setFieldValue('custrecord_priority', loadRec.getFieldValue('custrecord_pmp_priority'));

		create_record.setFieldValue('custrecord155', qry[counter].getId());
		create_record.setFieldValue('custrecord_cost_center', loadRec.getFieldValue('custrecord_pmp_cost_center'));	
		create_record.setFieldValue('custrecord242', loadRec.getFieldValue('custrecord243'));
		create_record.setFieldValue('custrecord247', loadRec.getFieldValue('custrecord245'));
		create_record.setFieldValue('custrecord248', loadRec.getFieldValue('custrecord244'));
		create_record.setFieldValue('custrecord_activity_type', loadRec.getFieldValue('custrecord_pmp_activity_type'));
		create_record.setFieldValue('custrecord_planner', loadRec.getFieldValue('custrecord_pmp_planner_group'));
		create_record.setFieldValue('custrecord_asset', loadRec.getFieldValue('custrecord_pmp_asset'));
		create_record.setFieldValue('custrecord_document_status', loadRec.getFieldValue('custrecord_pmp_document_status'));
		create_record.setFieldValue('custrecord240', loadRec.getFieldValue('custrecord237'));



		//sets forever mandatory fields
		create_record.setFieldValue('custrecord_source_list', loadRec.getFieldValue('custrecord_pmp_source_list'));
		create_record.setFieldValue('custrecord_created_by', 32);
		create_record.setFieldValue('custrecord_reported_by', 32);

		var workOrderId = nlapiSubmitRecord(create_record);

		
		//get [WO] Special Permit
		var SPWhere = [ new nlobjSearchFilter('custrecord159', null, 'is', qry[counter].getId())];
		var SPRet = [ new nlobjSearchColumn('custrecord150')];
		var SPSearchRecord = nlapiSearchRecord('customrecord316', null, SPWhere, SPRet);
		if(SPSearchRecord != null) {
			//create record for [WO] Special Permit
			for(var SPCounter = 0; SPCounter < SPSearchRecord.length; SPCounter++) {
				var createWOSP = nlapiCreateRecord('customrecord316');
				createWOSP.setFieldValue('custrecord150', SPSearchRecord[SPCounter].getValue('custrecord150'));
				createWOSP.setFieldValue('custrecord151', workOrderId);
				nlapiSubmitRecord(createWOSP);
			}
		}


		//get [WO] PPE
		var PPEWhere = [ new nlobjSearchFilter('custrecord158', null, 'is', qry[counter].getId())];
		var PPERet = [ new nlobjSearchColumn('custrecord148')];
		var PPESearchRecord = nlapiSearchRecord('customrecord315', null, PPEWhere, PPERet);
		if(PPESearchRecord != null) {
			//create record for [WO] Special Permit
			for(var PPECounter = 0; PPECounter < PPESearchRecord.length; PPECounter++) {
				var createWOPPE = nlapiCreateRecord('customrecord315');
				createWOPPE.setFieldValue('custrecord148', PPESearchRecord[PPECounter].getValue('custrecord148'));
				createWOPPE.setFieldValue('custrecord149', workOrderId);
				nlapiSubmitRecord(createWOPPE);
			}
		}


		//get [WO] Service
		var SWhere = [ new nlobjSearchFilter('custrecord157', null, 'is', qry[counter].getId())];
		var SRet = [ new nlobjSearchColumn('custrecord131'), 
					new nlobjSearchColumn('custrecord132'), 
					new nlobjSearchColumn('custrecord133'), 
					new nlobjSearchColumn('custrecord134'), 
					new nlobjSearchColumn('custrecord135'), 
					new nlobjSearchColumn('custrecord136') ];
		var SSearchRecord = nlapiSearchRecord('customrecord311', null, SWhere, SRet);
		if(SSearchRecord != null) {
			//create record for [WO] Special Permit
			for(var SCounter = 0; SCounter < SSearchRecord.length; SCounter++) {
				var createWOS = nlapiCreateRecord('customrecord311');
				createWOS.setFieldValue('custrecord131', SSearchRecord[SCounter].getValue('custrecord131'));
				createWOS.setFieldValue('custrecord132', SSearchRecord[SCounter].getValue('custrecord132'));
				createWOS.setFieldValue('custrecord133', SSearchRecord[SCounter].getValue('custrecord133'));
				createWOS.setFieldValue('custrecord134', SSearchRecord[SCounter].getValue('custrecord134'));
				createWOS.setFieldValue('custrecord135', SSearchRecord[SCounter].getValue('custrecord135'));
				createWOS.setFieldValue('custrecord136', SSearchRecord[SCounter].getValue('custrecord136'));
				createWOS.setFieldValue('custrecord138', workOrderId);
				nlapiSubmitRecord(createWOS);
			}
		}


		//get [WO] Components
		var CWhere = [ new nlobjSearchFilter('custrecord156', null, 'is', qry[counter].getId())];
		var CRet = [ new nlobjSearchColumn('custrecord139'), 
					new nlobjSearchColumn('custrecord140'), 
					new nlobjSearchColumn('custrecord141'), 
					new nlobjSearchColumn('custrecord142'), 
					new nlobjSearchColumn('custrecord143'), 
					new nlobjSearchColumn('custrecord144'), 
					new nlobjSearchColumn('custrecord145') ];
		var CSearchRecord = nlapiSearchRecord('customrecord312', null, CWhere, CRet);
		if(CSearchRecord != null) {
			//create record for [WO] Special Permit
			for(var CCounter = 0; CCounter < CSearchRecord.length; CCounter++) {
				var createWOC = nlapiCreateRecord('customrecord312');
				createWOC.setFieldValue('custrecord139', CSearchRecord[CCounter].getValue('custrecord139'));
				createWOC.setFieldValue('custrecord140', CSearchRecord[CCounter].getValue('custrecord140'));
				createWOC.setFieldValue('custrecord141', CSearchRecord[CCounter].getValue('custrecord141'));
				createWOC.setFieldValue('custrecord142', CSearchRecord[CCounter].getValue('custrecord142'));
				createWOC.setFieldValue('custrecord143', CSearchRecord[CCounter].getValue('custrecord143'));
				createWOC.setFieldValue('custrecord144', CSearchRecord[CCounter].getValue('custrecord144'));
				createWOC.setFieldValue('custrecord145', CSearchRecord[CCounter].getValue('custrecord145'));
				createWOC.setFieldValue('custrecord147', workOrderId);
				nlapiSubmitRecord(createWOC);
			}
		}


		//then update the preventive maintenance plan ready for the next cycle
		var cycleUnit = parseInt(loadRec.getFieldValue('custrecord_pmp_cycle_unit'));
		var unit = loadRec.getFieldValue('custrecord165');
		var start_sked = loadRec.getFieldValue('custrecord_pmp_start_sched_date');
		var lastInspection = loadRec.getFieldValue('custrecord_last_inspection_date');
		var advanceOrder = loadRec.getFieldValue('custrecord_pmp_scheduling_period');
		var advanceCycle = loadRec.getFieldValue('custrecord235');
		var lastTrigger = loadRec.getFieldValue('custrecord234');
		var fixedVariable = loadRec.getFieldValue('custrecord_pmp_fixed_variable');
		var nextCycleDate = loadRec.getFieldValue('custrecord236');
		var nextTriggerDate = loadRec.getFieldValue('custrecord_next_inspection_date');

		if(fixedVariable == 1) {//set value of last next trigger date
			loadRec.setFieldValue('custrecord234', nextTriggerDate);
			loadRec.setFieldValue('custrecord_last_inspection_date', nextCycleDate);
			//sets value of close date
			loadRec.setFieldValue('custrecord241', '');
			loadRec.setFieldValue('custrecord236', addDays(cycleUnit, reverseDate(loadRec.getFieldValue('custrecord_last_inspection_date')), unit, 'add'));
				//sets the value of next trigger date.
			loadRec.setFieldValue('custrecord_next_inspection_date', addDays(advanceOrder, reverseDate(loadRec.getFieldValue('custrecord236')), advanceCycle, 'subtract'));
		}
		nlapiSubmitRecord(loadRec);
	}
} 



function reverseDate(thisDate) {
	var reverseDate = thisDate.split('/'); //date format of netsuite starts from day but javascript was set to month so kinda reverse the day and month
	return reverseDate[1] + '/' + reverseDate[0] + '/' + reverseDate[2];
}



//function to set current date when the cycle and scheduling period will be added.
function addDays(daysToAdd, passedDate, unit, action) {
	var newDate = new Date(passedDate);
	if(action === 'add') {
		if(unit == 1) { //means the scheduled date is per DAY
		newDate.setDate(newDate.getDate() + daysToAdd);
		} else if(unit == 2) { //means per Month
			newDate.setMonth((newDate.getMonth() + daysToAdd));
		} else if(unit == 3) { //means per year
			newDate.setFullYear(newDate.getFullYear() + daysToAdd);
		} else if(unit == 4) { //means per Month
			newDate.setDate(newDate.getDate() + (daysToAdd*7));
		}
	} else {
		if(unit == 1) { //means the scheduled date is per DAY
		newDate.setDate(newDate.getDate() - daysToAdd);
		} else if(unit == 2) { //means per Month
			newDate.setMonth((newDate.getMonth() - daysToAdd));
		} else if(unit == 3) { //means per year
			newDate.setFullYear(newDate.getFullYear() - daysToAdd);
		} else if(unit == 4) { //means per Month
			newDate.setDate(newDate.getDate() - (daysToAdd*7));
		}
	}
	return newDate.getDate() + '/' + (Number(newDate.getMonth())+1) + '/' + newDate.getFullYear();
}