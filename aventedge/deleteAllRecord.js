/*
	*Author: [HTTP]
	*Custom code to delete all records
*/

function deleteAllRecords() {
	var SLICE_LIMIT = 1000;
    var search = nlapiCreateSearch('contact', null, null);
    var resultset = search.runSearch();
    var counter = 0;
    var results = [];

    do {
        var subset = resultset.getResults(counter, counter+1000);
        if ( !subset ) break;
        subset.forEach( function (row) {
            nlapiDeleteRecord('contact', row.getId());
        counter++;
        });
        nlapiYieldScript();
    } while (subset.length === SLICE_LIMIT);
}