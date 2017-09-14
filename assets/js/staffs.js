$(document).ready(function() {
	display();
    $("#entry-time").pickadate('picker').set('select', new Date()).trigger('change');
	
	$("#staff").submit(function(e) {
		e.preventDefault();

		data = {"destination": 3, "operation": (modifyingStaff ? 3 : 2)};
		$(this).serializeArray().map(function(x){data[x.name] = x.value;});
		data["staffID"] = parseFloat($("#ID").val());
		data["salary"] = parseFloat(data["salary"]);
		data = JSON.stringify(data);

		$.post(
			'./assets/API/api.cgi',
			data,
			function(response) {
				if (response.code == 0) {
					Materialize.toast('员工信息' + (modifyingStaff ? '修改' : '添加') + '成功！', 1700);
					setTimeout(function () {
						$("#staff").modal('close');
						display();
						
						//Reset All Input Data
						$("input").val('');
						$("select").val(0).material_select();
						$("label").removeClass("active");
					}, 2000);
				}
			}
		)

		.fail(function() {
			Materialize.toast('操作失败', 3000);
		});
	});
});

function update() {
	modifyingStaff = true;
	var info = $($("#display > tr")[$("#ID").val()]).children();
	
	//Show Form In Modifying Mode
	$("#staff-header").text('修改员工信息');
	$("#btn-staff").text('确认修改');
	$("label").addClass("active");

	//Fill Form With Corresponding Value
	$("#jobNo").val(info[1].textContent);
	$("#name").val(info[2].textContent);
	$("#nation").val(info[4].textContent);
	$("#native-place").val(info[5].textContent);
	$("#postion").val(info[7].textContent);
	$("#contact").val(info[9].textContent);
	$("#address").val(info[10].textContent);
	$("#salary").val(info[11].textContent);

	$("#gender").val(info[3].textContent).material_select();
	$("#department").val(info[6].textContent).material_select();
	$("#status").val(info[13].textContent).material_select();

	$("#birthday").pickadate('picker').set('select', info[8].textContent).trigger('change');
	$("#entry-time").pickadate('picker').set('select', info[12].textContent).trigger('change');

	$("#search").modal('close');
	$("#staff").modal('open');
}

function display() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 3, "operation": 1}),
		function(response) {
			$("#display").html('');
			$.each(response, function(i, staff) {
				$("#display").append(
					'<tr id="ID' + i + '">' +
						'<td>' + i + '</td>' +
						'<td>' + staff.jobNo + '</td>' +
						'<td>' + staff.name + '</td>' +
						'<td>' + staff.gender + '</td>' +
						'<td>' + staff.nation + '</td>' +
						'<td>' + staff.nativePlace + '</td>' +
						'<td>' + staff.department + '</td>' +
						'<td>' + staff.postion + '</td>' +
						'<td>' + staff.birthday + '</td>' +
						'<td>' + staff.contact + '</td>' +
						'<td>' + staff.address + '</td>' +
						'<td>' + staff.salary + '</td>' +
						'<td>' + staff.entryTime + '</td>' +
						'<td>' + staff.status + '</td>' +
					'</tr>');
			});
		}
	)

	.fail(function() {
		Materialize.toast('获取数据出错', 3000);
	});
}
