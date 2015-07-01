/*
    *Author: [HTTP]
    *This code snippet will gave the user the functionality to add, remove and filter contacts based on what the user needs
    *Date Written: 06/19/2015
*/


function targetList(request,response)
{
    if(request.getMethod() == 'GET') {
        
        var form = nlapiCreateForm(nlapiLookupField('customrecord_ms_target_list', request.getParameter('internalid'), 'name'), true);

        form.addSubmitButton('Submit');
        var form_ind = form.addField('industry', 'select', 'Industries', 'customlist1'); //load all industry in custom list
        var form_name = form.addField('inp_name', 'text', 'Name');
        var form_jobTitle = form.addField('job_title', 'text', 'Job Title');
        var form_company_name = form.addField('company_name', 'select', 'Company Name', 'customer');
        form.addField('hidden_field', 'text', 'Hidden');
        form.getField('hidden_field').setDefaultValue(request.getParameter('internalid'));
        form.getField('hidden_field').setDisplayType('hidden');


        //we will make a way to access the states Netsuite dont allow us to access
        var record = nlapiLoadRecord('contact', '102873');
        var field = record.getField('custentity33');
        options = field.getSelectOptions();
        var state = form.addField('state', 'select', 'State').setLayoutType('startrow').setDisplaySize(120);
        state.addSelectOption('', '');
        var stateCount = 0;
        for (var i in options) {
            var option = options[i];
            state.addSelectOption(stateCount, option.getText());
            stateCount++;
        }
        //will add a custom country json object here --------------------------
        var country = form.addField('country', 'select', 'Country').setLayoutType('midrow').setDisplaySize(150);
        country.addSelectOption('', '');
        //loop through each country
        var nsCountry = nsCountries();
        for(var x in nsCountry) { 
           country.addSelectOption(nsCountry[x], x);
        }

        //-----------------------------------------------------------------------


        var form_email = form.addField('inp_email', 'email', 'Email');
        var form_listcode = form.addField('list_codes', 'select', 'List Codes', 'customlist6'); //load all list codes in custom list
        var depart = form.addField('depart', 'select', 'Department', 'customlist205'); //add department lists


        //will add a custom Global Subscription Status here --------------------------

        var gss = form.addField('gss', 'select', 'Global Subscription Status');        
        gss.addSelectOption(1, 'Soft Opt-In');
        gss.addSelectOption(2, 'Soft Opt-Out');
        gss.addSelectOption(3, 'Confirmed Opt-In');    
        gss.addSelectOption(4, 'Confirmed Opt-Out');
        gss.addSelectOption('', 'All');
        gss.setDefaultValue(request.getParameter('gss'));

        //-----------------------------------------------------------------------


        //will add a custom Is Bounced Email here --------------------------

        var ibe = form.addField('ibe', 'select', 'Is Bounced Email');  
        ibe.addSelectOption('F', 'No');        
        ibe.addSelectOption('T', 'Yes');
        ibe.addSelectOption('', 'All');
        ibe.setDefaultValue(request.getParameter('ibe'));

        //-----------------------------------------------------------------------


        //will add a custom Decision Maker here --------------------------

        var dm = form.addField('dm', 'select', 'Decision Maker');
        dm.addSelectOption('', 'All');
        dm.addSelectOption('T', 'Yes');
        dm.addSelectOption('F', 'No');

        //-----------------------------------------------------------------------

     

       //Add Client script 'targetListClient' to suitelet form
       form.setScript('customscript_target_list_client');



        //add sublist on the form
        var sublist = form.addSubList('targetlist', 'list', null, 'target_list');
        sublist.addField('counter', 'text', '');
        sublist.addField('selected', 'checkbox', 'Selected');
        sublist.addField('industry', 'text', 'Industry');
        sublist.addField('entname', 'text', 'Name');
        sublist.addField('job_title', 'text', 'Job Title');
        sublist.addField('company_name', 'text', 'Company Name');
        sublist.addField('state', 'text', 'State');
        sublist.addField('countryname', 'text', 'Country');
        sublist.addField('emailadd', 'text', 'Email');
        sublist.addField('listcodes', 'text', 'List Codes');
        sublist.addField('department', 'text', 'Department');
        sublist.addField('intid', 'text', 'Internal Id');
        sublist.addMarkAllButtons();
        sublist.addField('lbl_gss', 'text', 'Global Subscription Status');
        sublist.addField('lbl_ibe', 'text', 'Is Bounced Email');
        sublist.addField('lbl_dm', 'text', 'Decision Maker');


        //get all the value of filters
        var industry = replaceNull(request.getParameter('industry'));
        var inp_name = replaceNull(request.getParameter('inp_name'));
        var job_title = replaceNull(request.getParameter('job_title'));
        var company_name = replaceNull(request.getParameter('company_name'));
        var country_name = replaceNull(request.getParameter('country'));
        var inp_email = replaceNull(request.getParameter('inp_email'));
        var list_codes = replaceNull(request.getParameter('list_codes'));
        var gss_name = replaceNull(request.getParameter('gss'));
        var ibe_name = replaceNull(request.getParameter('ibe'));
        var dm_name = replaceNull(request.getParameter('dm'));
        var page = (request.getParameter('pagi') == 'null') ? '': request.getParameter('pagi');
        var departm = replaceNull(request.getParameter('depart'));
        var st = replaceNull(request.getParameter('state'));
        //make an array of objects for convinience
        var arrayOfFilters = {};
        arrayOfFilters['industry'] = industry; 
        arrayOfFilters['inp_name'] = inp_name; 
        arrayOfFilters['job_title'] = job_title; 
        arrayOfFilters['company_name'] = company_name; 
        arrayOfFilters['country_name'] = country_name; 
        arrayOfFilters['inp_email'] = inp_email; 
        arrayOfFilters['list_codes'] = list_codes; 
        arrayOfFilters['gss_name'] = gss_name; 
        arrayOfFilters['ibe_name'] = ibe_name; 
        arrayOfFilters['dm_name'] = dm_name;
        arrayOfFilters['departm'] = departm;
        arrayOfFilters['state'] = st;



        //sets all the selected value 
        form_ind.setDefaultValue(industry);
        form_name.setDefaultValue(inp_name);
        form_jobTitle.setDefaultValue(job_title);
        form_company_name.setDefaultValue(company_name);
        country.setDefaultValue(country_name);
        form_email.setDefaultValue(inp_email);
        form_listcode.setDefaultValue(list_codes);
        gss.setDefaultValue(gss_name);
        ibe.setDefaultValue(ibe_name);
        dm.setDefaultValue(dm_name);
        depart.setDefaultValue(departm);
        state.setDefaultValue(st);
        //validate whether it will perform search or not
        if(validateFilters(arrayOfFilters) == true && request.getParameter('chkdsk') == 0) {
            //create a nlobjFilter
            var createFilter = [];
            var createResult = [];
            createResult.push(new nlobjSearchColumn('custentity1', 'parentCustomer'));
            createResult.push(new nlobjSearchColumn('entityid'));
            createResult.push(new nlobjSearchColumn('title'));
            createResult.push(new nlobjSearchColumn('company'));
            createResult.push(new nlobjSearchColumn('country'));
            createResult.push(new nlobjSearchColumn('email'));
            createResult.push(new nlobjSearchColumn('custentity4'));
            createResult.push(new nlobjSearchColumn('custentity_department'));
            createResult.push(new nlobjSearchColumn('globalsubscriptionstatus'));
            createResult.push(new nlobjSearchColumn('custentity8'));
            createResult.push(new nlobjSearchColumn('custentity20'));
            createResult.push(new nlobjSearchColumn('custentity33'));
            for(var filCounter in arrayOfFilters) {
                if(arrayOfFilters[filCounter] != '') {
                    //create filter here
                    switch(filCounter) {
                        case 'industry':
                            createFilter.push(new nlobjSearchFilter('custentity1', 'parentCustomer', 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'inp_name':
                            createFilter.push(new nlobjSearchFilter('entityid', null, 'contains', arrayOfFilters[filCounter]));
                        break;
                        case 'job_title':
                            createFilter.push(new nlobjSearchFilter('title', null, 'contains', arrayOfFilters[filCounter]));
                        break;
                        case 'company_name':
                            createFilter.push(new nlobjSearchFilter('company', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'state':
                            createFilter.push(new nlobjSearchFilter('custentity33', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'country_name':
                            createFilter.push(new nlobjSearchFilter('country', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'inp_email':
                            createFilter.push(new nlobjSearchFilter('email', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'list_codes':
                            createFilter.push(new nlobjSearchFilter('custentity4', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'departm':
                            createFilter.push(new nlobjSearchFilter('custentity_department', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'gss_name':
                            createFilter.push(new nlobjSearchFilter('globalsubscriptionstatus', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'ibe_name':
                            createFilter.push(new nlobjSearchFilter('custentity8', null, 'is', arrayOfFilters[filCounter]));
                        break;
                        case 'dm_name':
                            createFilter.push(new nlobjSearchFilter('custentity20', null, 'is', arrayOfFilters[filCounter]));
                        break;
                    }
                }
            }

            //create custom search
            var search = nlapiCreateSearch('contact', createFilter, createResult);
            var resultset = search.runSearch();
            var paginate = (request.getParameter('pagi') == 'null' || request.getParameter('pagi') == '' || request.getParameter('pagi') <= 0) ? 0:((request.getParameter('pagi')*50)-50);
            var results = [];

            var subset = resultset.getResults(paginate, paginate+50);
            if(subset != null){
                subset.forEach( function (row) {
                    results.push(row);
                });
            }
            if(results.length == 50) {
                form.addPageLink('crosslink', 'Next', 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=155&deploy=1&internalid='+request.getParameter('internalid')+'&industry='+industry+'&inp_name='+inp_name+'&job_title='+job_title+'&company_name='+company_name+'&country='+country_name+'&inp_email='+inp_email+'&list_codes='+list_codes+'&gss='+gss_name+'&ibe='+ibe_name+'&dm='+dm_name+'&depart='+departm+'&chkdsk=0&pagi='+(((paginate+50)/50)+1)+'&state='+st);
                form.addPageLink('crosslink', 'Prev', 'https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=155&deploy=1&internalid='+request.getParameter('internalid')+'&industry='+industry+'&inp_name='+inp_name+'&job_title='+job_title+'&company_name='+company_name+'&country='+country_name+'&inp_email='+inp_email+'&list_codes='+list_codes+'&gss='+gss_name+'&ibe='+ibe_name+'&dm='+dm_name+'&depart='+departm+'&chkdsk=0&pagi='+(((paginate+50)/50)-1)+'&state='+st);
            } 

            if(results.length > 0) {
                var i = 1;
                for(var x in results) {
                    //validate if this contact has record
                    var targetFilter = [ new nlobjSearchFilter('custrecord_tlc_target_list', null, 'is', request.getParameter('internalid')), 
                                         new nlobjSearchFilter('custrecord_tlc_customer', null, 'is', results[x].getId()) ];
                    var searchTargetList = nlapiSearchRecord(null, 'customsearch1693', targetFilter, null);
                    if(searchTargetList != null) {
                        sublist.setLineItemValue('selected', i, 'T');
                    }

                    // loop through each nlobjSearchResult object
                    sublist.setLineItemValue('counter', i, (paginate + 1).toString());
                    sublist.setLineItemValue('industry', i, results[x].getValue('custentity1', 'parentCustomer'));
                    sublist.setLineItemValue('entname', i, results[x].getValue('entityid'));
                    sublist.setLineItemValue('job_title', i, results[x].getValue('title'));
                    sublist.setLineItemValue('company_name', i, results[x].getValue('company'));
                    sublist.setLineItemValue('state', i, results[x].getValue('custentity33'));
                    sublist.setLineItemValue('countryname', i, results[x].getValue('country'));
                    sublist.setLineItemValue('emailadd', i, results[x].getValue('email'));
                    sublist.setLineItemValue('listcodes', i, results[x].getValue('custentity4'));
                    sublist.setLineItemValue('department', i, results[x].getValue('custentity_department'));
                    sublist.setLineItemValue('intid', i, results[x].getId());
                    sublist.setLineItemValue('lbl_gss', i, (results[x].getValue('globalsubscriptionstatus') == 'F')?'No':'Yes');
                    sublist.setLineItemValue('lbl_ibe', i, (results[x].getValue('custentity8') == 'F')?'No':'Yes');
                    sublist.setLineItemValue('lbl_dm', i, (results[x].getValue('custentity20') == 'F')?'No':'Yes');

                    i++; 
                    paginate++
                }
            }   

        }
        


       response.writePage(form);
    } else {
        var sublistCounter = request.getLineItemCount('targetlist');
        if(sublistCounter > 0) {     
            var html;       
            //loop trough each line item and save record
            for(var counter = 1; counter <= sublistCounter; counter++) {
                //validate if this contact has record
                var targetFilter = [ new nlobjSearchFilter('custrecord_tlc_target_list', null, 'is', request.getParameter('hidden_field')), 
                                     new nlobjSearchFilter('custrecord_tlc_customer', null, 'is', request.getLineItemValue('targetlist', 'intid', counter)) ];
                var searchTargetList = nlapiSearchRecord(null, 'customsearch1693', targetFilter, null);
                if(searchTargetList == null) {
                    if(request.getLineItemValue('targetlist', 'selected', counter) == 'T') {
                        var createTargetListRecord = nlapiCreateRecord('customrecord_ms_target_list_customers');
                        createTargetListRecord.setFieldValue('custrecord_tlc_target_list', request.getParameter('hidden_field'));
                        createTargetListRecord.setFieldValue('custrecord_tlc_customer', request.getLineItemValue('targetlist', 'intid', counter));
                        nlapiSubmitRecord(createTargetListRecord);
                        html += 'nasave na! ';
                    }
                } else {
                    if(request.getLineItemValue('targetlist', 'selected', counter) == 'F') {
                        nlapiDeleteRecord('customrecord_ms_target_list_customers', searchTargetList[0].getId());
                    }
                }
                var form = nlapiCreateForm('Record(s) Saved!');
            }
           
           
        } else {
            var form = nlapiCreateForm('Nothing to do here.');
        }
         response.writePage(form);
       
    }
}

function validateFilters(arrayOfFilters) {
    var val = false;
    for(var x in arrayOfFilters) {
        if(arrayOfFilters[x] != '') {
            val = true;
        } 
    }
    return val;
}


function replaceNull(value) {
    return (value == '' || value == null) ? '':value;
}



function nsCountries() {
    var nsCountry= {
        "Afghanistan":"AF",
        "Aland Islands":"AX",
        "Albania":"AL",
        "Algeria":"DZ",
        "American Samoa":"AS",
        "Andorra":"AD",
        "Angola":"AO",
        "Anguilla":"AI",
        "Antarctica":"AQ",
        "Antigua and Barbuda":"AG",
        "Argentina":"AR",
        "Armenia":"AM",
        "Aruba":"AW",
        "Australia":"AU",
        "Austria":"AT",
        "Azerbaijan":"AZ",
        "Bahamas":"BS",
        "Bahrain":"BH",
        "Bangladesh":"BD",
        "Barbados":"BB",
        "Belarus":"BY",
        "Belgium":"BE",
        "Belize":"BZ",
        "Benin":"BJ",
        "Bermuda":"BM",
        "Bhutan":"BT",
        "Bolivia":"BO",
        "Bonaire, Saint Eustatius and Saba":"BQ",
        "Bosnia and Herzegovina":"BA",
        "Botswana":"BW",
        "Bouvet Island":"BV",
        "Brazil":"BR",
        "British Indian Ocean Territory":"IO",
        "Brunei Darussalam":"BN",
        "Bulgaria":"BG",
        "Burkina Faso":"BF",
        "Burundi":"BI",
        "Cambodia":"KH",
        "Cameroon":"CM",
        "Canada":"CA",
        "Canary Islands":"IC",
        "Cape Verde":"CV",
        "Cayman Islands":"KY",
        "Central African Republic":"CF",
        "Ceuta and Melilla":"EA",
        "Chad":"TD",
        "Chile":"CL",
        "China":"CN",
        "Christmas Island":"CX",
        "Cocos (Keeling) Islands":"CC",
        "Colombia":"CO",
        "Comoros":"KM",
        "Congo, Democratic People's Republic":"CD",
        "Congo, Republic of":"CG",
        "Cook Islands":"CK",
        "Costa Rica":"CR",
        "Cote d'Ivoire":"CI",
        "Croatia/Hrvatska":"HR",
        "Cuba":"CU",
        "Curaçao":"CW",
        "Cyprus":"CY",
        "Czech Republic":"CZ",
        "Denmark":"DK",
        "Djibouti":"DJ",
        "Dominica":"DM",
        "Dominican Republic":"DO",
        "East Timor":"TP",
        "Ecuador":"EC",
        "Egypt":"EG",
        "El Salvador":"SV",
        "Equatorial Guinea":"GQ",
        "Eritrea":"ER",
        "Estonia":"EE",
        "Ethiopia":"ET",
        "Falkland Islands":"FK",
        "Faroe Islands":"FO",
        "Fiji":"FJ",
        "Finland":"FI",
        "France":"FR",
        "French Guiana":"GF",
        "French Polynesia":"PF",
        "French Southern Territories":"TF",
        "Gabon":"GA",
        "Gambia":"GM",
        "Georgia":"GE",
        "Germany":"DE",
        "Ghana":"GH",
        "Gibraltar":"GI",
        "Greece":"GR",
        "Greenland":"GL",
        "Grenada":"GD",
        "Guadeloupe":"GP",
        "Guam":"GU",
        "Guatemala":"GT",
        "Guernsey":"GG",
        "Guinea":"GN",
        "Guinea-Bissau":"GW",
        "Guyana":"GY",
        "Haiti":"HT",
        "Heard and McDonald Islands":"HM",
        "Holy See (City Vatican State)":"VA",
        "Honduras":"HN",
        "Hong Kong":"HK",
        "Hungary":"HU",
        "Iceland":"IS",
        "India":"IN",
        "Indonesia":"ID",
        "Iran (Islamic Republic of)":"IR",
        "Iraq":"IQ",
        "Ireland":"IE",
        "Isle of Man":"IM",
        "Israel":"IL",
        "Italy":"IT",
        "Jamaica":"JM",
        "Japan":"JP",
        "Jersey":"JE",
        "Jordan":"JO",
        "Kazakhstan":"KZ",
        "Kenya":"KE",
        "Kiribati":"KI",
        "Korea, Democratic People's Republic":"KP",
        "Korea, Republic of":"KR",
        "Kosovo":"XK",
        "Kuwait":"KW",
        "Kyrgyzstan":"KG",
        "Lao People's Democratic Republic":"LA",
        "Latvia":"LV",
        "Lebanon":"LB",
        "Lesotho":"LS",
        "Liberia":"LR",
        "Libyan Arab Jamahiriya":"LY",
        "Liechtenstein":"LI",
        "Lithuania":"LT",
        "Luxembourg":"LU",
        "Macau":"MO",
        "Macedonia":"MK",
        "Madagascar":"MG",
        "Malawi":"MW",
        "Malaysia":"MY",
        "Maldives":"MV",
        "Mali":"ML",
        "Malta":"MT",
        "Marshall Islands":"MH",
        "Martinique":"MQ",
        "Mauritania":"MR",
        "Mauritius":"MU",
        "Mayotte":"YT",
        "Mexico":"MX",
        "Micronesia, Federal State of":"FM",
        "Moldova, Republic of":"MD",
        "Monaco":"MC",
        "Mongolia":"MN",
        "Montenegro":"ME",
        "Montserrat":"MS",
        "Morocco":"MA",
        "Mozambique":"MZ",
        "Myanmar (Burma)":"MM",
        "Namibia":"NA",
        "Nauru":"NR",
        "Nepal":"NP",
        "Netherlands":"NL",
        "Netherlands Antilles (Deprecated)":"AN",
        "New Caledonia":"NC",
        "New Zealand":"NZ",
        "Nicaragua":"NI",
        "Niger":"NE",
        "Nigeria":"NG",
        "Niue":"NU",
        "Norfolk Island":"NF",
        "Northern Mariana Islands":"MP",
        "Norway":"NO",
        "Oman":"OM",
        "Pakistan":"PK",
        "Palau":"PW",
        "Palestinian Territories":"PS",
        "Panama":"PA",
        "Papua New Guinea":"PG",
        "Paraguay":"PY",
        "Peru":"PE",
        "Philippines":"PH",
        "Pitcairn Island":"PN",
        "Poland":"PL",
        "Portugal":"PT",
        "Puerto Rico":"PR",
        "Qatar":"QA",
        "Reunion Island":"RE",
        "Romania":"RO",
        "Russian Federation":"RU",
        "Rwanda":"RW",
        "Saint Barthélemy":"BL",
        "Saint Helena":"SH",
        "Saint Kitts and Nevis":"KN",
        "Saint Lucia":"LC",
        "Saint Martin":"MF",
        "Saint Vincent and the Grenadines":"VC",
        "Samoa":"WS",
        "San Marino":"SM",
        "Sao Tome and Principe":"ST",
        "Saudi Arabia":"SA",
        "Senegal":"SN",
        "Serbia":"RS",
        "Serbia and Montenegro (Deprecated)":"CS",
        "Seychelles":"SC",
        "Sierra Leone":"SL",
        "Singapore":"SG",
        "Sint Maarten":"SX",
        "Slovak Republic":"SK",
        "Slovenia":"SI",
        "Solomon Islands":"SB",
        "Somalia":"SO",
        "South Africa":"ZA",
        "South Georgia":"GS",
        "South Sudan":"SS",
        "Spain":"ES",
        "Sri Lanka":"LK",
        "St. Pierre and Miquelon":"PM",
        "Sudan":"SD",
        "Suriname":"SR",
        "Svalbard and Jan Mayen Islands":"SJ",
        "Swaziland":"SZ",
        "Sweden":"SE",
        "Switzerland":"CH",
        "Syrian Arab Republic":"SY",
        "Taiwan":"TW",
        "Tajikistan":"TJ",
        "Tanzania":"TZ",
        "Thailand":"TH",
        "Togo":"TG",
        "Tokelau":"TK",
        "Tonga":"TO",
        "Trinidad and Tobago":"TT",
        "Tunisia":"TN",
        "Turkey":"TR",
        "Turkmenistan":"TM",
        "Turks and Caicos Islands":"TC",
        "Tuvalu":"TV",
        "Uganda":"UG",
        "Ukraine":"UA",
        "United Arab Emirates":"AE",
        "United Kingdom (GB)":"GB",
        "United States":"US",
        "Uruguay":"UY",
        "US Minor Outlying Islands":"UM",
        "Uzbekistan":"UZ",
        "Vanuatu":"VU",
        "Venezuela":"VE",
        "Vietnam":"VN",
        "Virgin Islands (British)":"VG",
        "Virgin Islands (USA)":"VI",
        "Wallis and Futuna":"WF",
        "Western Sahara":"EH",
        "Yemen":"YE",
        "Zambia":"ZM",
        "Zimbabwe":"ZW"
    };

    return nsCountry;
}