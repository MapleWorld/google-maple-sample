/* Filename			:	DownloadScript.js
 * Last Modified	:	18/04/2014
 * Functionality	:	To make WebReport's result downloadable. 
 */


/* dynamically bind behaviors to HTML objects */
$(function(){
	$('#parent').on('click', '#downloadSelected', downloadSelectedQueries);
	$('#parent').on('click', '#checkAll', checkAll);
	$('#parent').on('click', '#uncheckAll', uncheckAll);
});


/* Idea		:	If 'mode' is report, the client is querying either 'execution' or 'generation'
 * 				The availablity of 'QUERYNO' immediately implies that of 'BATCHNO'. 
 * 				If 'QUERYNO' is not part of WebReport's result, we have to  retrieve SQLs
 * 				by either 'EXECNO' or 'BATCH'. For example, if the report results as follow
 * 					+----------+----------+
 * 					| BATCNO   | QUERYNO  |
 * 					+----------+----------+
 * 					|   123    |   8      |
 * 					|   111    |   3      |
 * 	 				+----------+----------+
 * 				The current function will send "values (123, 8), (111, 3)" to the server.
 * 				By checking 'hasBatchNo', 'hasQueryNo' and 'hasExecNo', the server knows it
 * 				should compose a query 
 * 				"	select 	SQL_STATEMENT
 * 					from 	GEN_QUERIES_SETS as T1, 
 * 							(values (123, 8), (111, 3)) as T2 (BATCHNO, QUERYNO)
 *					where	T1.BATCHNO = T2.BATCHNO and T1.QUERYNO = T2.QUERYNO "
 */
function downloadSelectedQueries () {
	var batchNoIdx =  -1;
	var queryNoIdx = -1;
	var execNoIdx = -1;
	var sqlStmtIdx = -1;
	
	$("#content th").each(function(index, item){
		if (item.textContent == 'BATCHNO') {
			batchNoIdx = index;
		}
		if (item.textContent == 'QUERYNO') {
			queryNoIdx = index;
		}
		if (item.textContent == 'EXECNO') {
			execNoIdx = index;
		}
		if (item.textContent == 'SQL_STATEMENT' || item.textContent == "SQLSTATEMENT")
		{
			sqlStmtIdx = index;
		}
	});
	
	
	var tableToJoin = 'values ';
	var selectedCheckedBox = $("#content input[type=checkbox]:checked");
	
	if (selectedCheckedBox.length === 0){
		return;
	}
	
	selectedCheckedBox.each(function(index, item){
		if (index !== 0) {
			tableToJoin += ", ";
		}
		// checkbox's parent and grandparent are <td> and <tr> respectively 
		if (queryNoIdx !== -1) {
			var batchNo = item.parentElement.parentElement.children[batchNoIdx].textContent;
			var queryNo = item.parentElement.parentElement.children[queryNoIdx].textContent;
			tableToJoin += "(" + batchNo + ", " + queryNo + ")";
		}
		else if (batchNoIdx !== -1) {
			var batchNo = item.parentElement.parentElement.children[batchNoIdx].textContent;
			tableToJoin += "(" + batchNo +  ")";
		}
		else if (execNoIdx !== -1) {
			var execNo = item.parentElement.parentElement.children[execNoIdx].textContent;
			tableToJoin += "(" + execNo + ")";
		}
		else {	// the client is in the page of a single detailed SQL
				// If so, the content can be retrieved directly from the current page 
			if (sqlStmtIdx !== -1) {
				var stmt = item.parentElement.parentElement.children[sqlStmtIdx].textContent;
				window.location.href = 
					"data:application/octet-stream," + encodeURIComponent(stmt);
				return;
			}
		}
	});
	
	$.ajax({
		type : "POST",
		url : "Servlet",
		data : {
			mode : "Download",
			hasBatchNo : (batchNoIdx !== -1 && queryNoIdx === -1),
			hasQueryNo : queryNoIdx !== -1,
			hasExecNo : (execNoIdx !== -1 && queryNoIdx === -1),
			tableToJoin : tableToJoin
		},
		success : function(data){
		// Enforce binary transmission by "data:application/octet-stream,"
		// Otherwise, the browser may display it as text instead of downloading
			window.location.href = 
				"data:application/octet-stream," + encodeURIComponent(data);
		}
	});
}


/* Mark all items of the table residing at '#content' checked */
function checkAll() {
	$("#content input[type=checkbox]").each(function(index, item) {
		item.checked = true;
	});
}


/* Mark all items of the table residing at '#content' unchecked */
function uncheckAll() {
	$("#content input[type=checkbox]").each(function(index, item) {
		item.checked = false;	
	});
}


/* Add checkbox to each row; 'checked' by default. */
function addCheckBox(){
	$("#content > table > tbody > tr" ).each(function(index, item) {
		if (index != 0) {
			var row = item.innerHTML;
			var checkBox = "<td><input type = 'checkbox' checked = 'checked'></td>";
			item.innerHTML = checkBox + row;
		}
		else {
			item.innerHTML = "<th name = 'GEN_BATCH'> </th>" + item.innerHTML;
		}
	});
};


function callServletDeleteMethod () {
	
};
