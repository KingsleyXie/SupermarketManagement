var dest = 4, operation = 2, data = {};

var date = new Date();
var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
var time = year + "-" + month + "-" + day;

$(document).ready(function() {
	$(".button-collapse").sideNav();
	$('.modal').modal();
	$('select').material_select();
	
	$('#finance').submit(function(e) {
		e.preventDefault();
		data = {};
		$(this).serializeArray().map(function(x){data[x.name] = x.value;}); 
		data["dest"] = dest; data["operation"] = operation;
		data["year"] = parseFloat(year);
		data["month"] = parseFloat(month);
		data["day"] = parseFloat(day);
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
						Materialize.toast("财务流水添加成功！", 3000);
					}

					window.setTimeout(function ()
					{
						window.location.href = "./finance";
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
			for (var i = 0; i <= response.length - 1; i++) {
				document.getElementById("display").innerHTML += 
					"<tr id=\"ID" + i + "\">" +
						"<th>" + i + "</th>" + 
						"<th>" + response[i].name + "</th>" + 
						"<th>" + response[i].income + "</th>" + 
						"<th>" + response[i].expenditure + "</th>" + 
						"<th>" + response[i].date.year + "</th>" + 
						"<th>" + response[i].date.month + "</th>" + 
						"<th>" + response[i].date.day + "</th>" + 
					"</tr>";
			}
		}
	});
});
