var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate();

$(document).ready(function() {
	$(".modal").modal();
	$("select").material_select();
	$(".button-collapse").sideNav();
	
	display(); $("#loading").hide();

	$("#finance").submit(function(e) {
		e.preventDefault();

		data = {"dest": 4, "operation": 2, "year": year, "month": month, "day": day};
		$(this).serializeArray().map(function(x){data[x.name] = x.value;});
		data["income"] = parseFloat(data["income"]);
		data["expenditure"] = parseFloat(data["expenditure"]);
		data = JSON.stringify(data);

		$.ajax({
			type: 'POST',
			url: './assets/API/api.cgi',
			contentType: 'application/json; charset=utf-8',
			data: data,
			success: function(response) {
				if (response.code == 0) {
					Materialize.toast('财务流水添加成功！', 1700);
					setTimeout(function () {
						$("#finance").modal('close');
						display();
					}, 2000);
				}
			}
		});
	});
});

function display() {
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({"dest": 4, "operation": 1}),
		success: function(response) {
			$("#display").html('');
			for (var i = 0; i < response.length; i++) {
				$("#display").append(
				'<tr>' +
					'<td>' + i + '</td>' +
					'<td>' + response[i].name + '</td>' +
					'<td>' + response[i].income + '</td>' +
					'<td>' + response[i].expenditure + '</td>' +
					'<td>' + response[i].date.year + '</td>' +
					'<td>' + response[i].date.month + '</td>' +
					'<td>' + response[i].date.day + '</td>' +
				'</tr>');
			}
		}
	});
}
