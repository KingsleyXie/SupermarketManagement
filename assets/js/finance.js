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

		$.post(
			'./assets/API/api.cgi',
			data,
			function(response) {
				if (response.code == 0) {
					Materialize.toast('财务流水添加成功！', 1700);
					setTimeout(function () {
						$("#finance").modal('close');
						display();
					}, 2000);
				}
			}
		)

		.fail(function() {
			Materialize.toast('财务流水添加出错', 3000);
		});
	});
});

function display() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"dest": 4, "operation": 1}),
		function(response) {
			$("#display").html('');
			$.each(response, function(i, finance) {
				$("#display").append(
				'<tr>' +
					'<td>' + i + '</td>' +
					'<td>' + finance.name + '</td>' +
					'<td>' + finance.income + '</td>' +
					'<td>' + finance.expenditure + '</td>' +
					'<td>' + finance.date.year + '</td>' +
					'<td>' + finance.date.month + '</td>' +
					'<td>' + finance.date.day + '</td>' +
				'</tr>');
			});
		}
	)

	.fail(function() {
		Materialize.toast('获取数据出错', 3000);
	});
}
