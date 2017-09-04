var dest = 3, operation = 2, data = {};

$(document).ready(function() {
	document.getElementById("loading").style.display = "flex";

	$(".button-collapse").sideNav();
	$('.modal').modal();
	$('select').material_select();
	$('.datepicker').pickadate({
    	selectMonths: true,
    	selectYears: 15,
    	format:'yyyy-mm-dd'
    });
	
	$('#staff').submit(function(e) {
		e.preventDefault();
		data = {};
		$(this).serializeArray().map(function(x){data[x.name] = x.value;}); 
		data["dest"] = dest; data["operation"] = operation;
		data["staffID"] = parseFloat(document.getElementById("ID").value);
		data["salary"] = parseFloat(data["salary"]);
		data = JSON.stringify(data);
		$.ajax({
			type: "POST",
			url: './assets/API/api.cgi',
			contentType: "application/json; charset=utf-8",
			data: data,
			dataType: "json",
			success: function(response)
			{
				if (response.code == 0) {
					if (operation == 2) {
						Materialize.toast("员工信息添加成功！", 3000);
					}
					if (operation == 3) {
						Materialize.toast("员工信息修改成功！", 3000);
					}

					window.setTimeout(function ()
					{
						window.location.href = "./staffs";
					}, 3600);
				}
			}
		});
	});

	data = {};
	data["dest"] = dest; data["operation"] = 1;
	data = JSON.stringify(data);
	$.ajax({
		type: "POST",
		url: "./assets/API/api.cgi",
		contentType: "application/json; charset=utf-8",
		data: data,
		dataType: "json",
		success: function(response)
		{
			document.getElementById("loading").style.display = "none";
			for (var i = 0; i <= response.length - 1; i++) {
				document.getElementById("display").innerHTML += 
					"<tr id=\"ID" + i + "\">" +
						"<th>" + i + "</th>" + 
						"<th>" + response[i].jobNo + "</th>" + 
						"<th>" + response[i].name + "</th>" + 
						"<th>" + response[i].gender + "</th>" + 
						"<th>" + response[i].nation + "</th>" + 
						"<th>" + response[i].nativePlace + "</th>" + 
						"<th>" + response[i].department + "</th>" + 
						"<th>" + response[i].postion + "</th>" + 
						"<th>" + response[i].birthday + "</th>" + 
						"<th>" + response[i].contact + "</th>" + 
						"<th>" + response[i].address + "</th>" + 
						"<th>" + response[i].salary + "</th>" + 
						"<th>" + response[i].entryTime + "</th>" + 
						"<th>" + response[i].status + "</th>" + 
					"</tr>";
			}
		}
	});
});



function update() {
	var info = document.getElementById("ID" + document.getElementById("ID").value).cells;

	document.getElementById("staffHeader").textContent = "修改员工信息";
	document.getElementById("staffBtn").textContent = "确认修改";
	
	document.querySelector("#jobNo + label").className ="active";
	document.getElementById("jobNo").value = info[1].textContent;
	document.querySelector("#name + label").className ="active";
	document.getElementById("name").value = info[2].textContent;
	document.querySelector("#nation + label").className ="active";
	document.getElementById("nation").value = info[4].textContent;
	document.querySelector("#nativePlace + label").className ="active";
	document.getElementById("nativePlace").value = info[5].textContent;
	document.querySelector("#postion + label").className ="active";
	document.getElementById("postion").value = info[7].textContent;
	document.querySelector("#contact + label").className ="active";
	document.getElementById("contact").value = info[9].textContent;
	document.querySelector("#address + label").className ="active";
	document.getElementById("address").value = info[10].textContent;
	document.querySelector("#salary + label").className ="active";
	document.getElementById("salary").value = info[11].textContent;

	$('#gender').val(info[3].textContent);	$('#gender').material_select();
	$('#department').val(info[6].textContent);	$('#department').material_select();
	$('#status').val(info[13].textContent);	$('#status').material_select();

	$('#birthday').pickadate('picker').set('select', info[8].textContent, { format: 'yyyy-mm-dd' }).trigger("change");
	$('#entryTime').pickadate('picker').set('select', info[12].textContent, { format: 'yyyy-mm-dd' }).trigger("change");

	$("#search").modal("close");
	$("#staff").modal("open");

	operation = 3;
}
