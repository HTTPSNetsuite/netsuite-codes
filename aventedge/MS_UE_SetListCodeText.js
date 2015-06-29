/**
 * Copyright (c) 2014 SuiteSense Inc.
 * Mississauga, ON Canada
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * SuiteSense ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with SuiteSense.
 *
 * SVN      ::    $Id$
 *
 * Project  ::    Multiselect List Code
 * Filename ::    MS_UE_SetListCodeText.js
 * Created  ::    22 May 2014
 * Author   ::    Michael
 *
 * Notes    ::
 *              <date> :  <note>
 *
 */

function afterSubmit_setListCodeText(stEvent) {
	if (stEvent != 'create' && stEvent != 'edit' && stEvent != 'xedit') return;

	var stRecType = nlapiLookupField('entity', nlapiGetRecordId(), 'recordType');
	var recCust = nlapiLoadRecord(stRecType, nlapiGetRecordId());
	
	var arrListCodeTexts = recCust.getFieldTexts('custentity4');
	
	var stListCodeText = '';
	
	for (var idx=0; idx < arrListCodeTexts.length; idx++) {
		stListCodeText += (stListCodeText.length > 0?',':'') + arrListCodeTexts[idx];
	}
	
	nlapiSubmitField(stRecType, nlapiGetRecordId(), 'custentity_ms_hidden_list_code_text', stListCodeText);
}
