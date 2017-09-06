$("#loading").css('display', 'flex');
display(); $("#loading").hide();
var modifying = false;

$(document).ready(function() {
	$(".modal").modal();
	$("select").material_select();
	$(".button-collapse").sideNav();
	$(".datepicker").pickadate({
    	selectMonths: true,
    	selectYears: 15,
    	format: 'yyyy-mm-dd'
    });
    $("#entry-time").pickadate('picker').set('select', new Date()).trigger('change');
	
	$("#staff").submit(function(e) {
		e.preventDefault();

		data = {"dest": 3, "operation": (modifying ? 3 : 2)};
		$(this).serializeArray().map(function(x){data[x.name] = x.value;});
		data["staffID"] = parseFloat($("#ID").val());
		data["salary"] = parseFloat(data["salary"]);
		data = JSON.stringify(data);

		$.ajax({
			type: 'POST',
			url: './assets/API/api.cgi',
			contentType: 'application/json; charset=utf-8',
			data: data,
			success: function(response) {
				if (response.code == 0) {
					Materialize.toast('员工信息' + (modifying ? '修改' : '添加') + '成功！', 1700);
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
		});
	});
});

function update() {
	modifying = true;
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
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({"dest": 3, "operation": 1}),
		success: function(response) {
			$("#display").html('');
			for (var i = 0; i < response.length; i++) {
				$("#display").append(
					'<tr id="ID' + i + '">' +
						'<td>' + i + '</td>' +
						'<td>' + response[i].jobNo + '</td>' +
						'<td>' + response[i].name + '</td>' +
						'<td>' + response[i].gender + '</td>' +
						'<td>' + response[i].nation + '</td>' +
						'<td>' + response[i].nativePlace + '</td>' +
						'<td>' + response[i].department + '</td>' +
						'<td>' + response[i].postion + '</td>' +
						'<td>' + response[i].birthday + '</td>' +
						'<td>' + response[i].contact + '</td>' +
						'<td>' + response[i].address + '</td>' +
						'<td>' + response[i].salary + '</td>' +
						'<td>' + response[i].entryTime + '</td>' +
						'<td>' + response[i].status + '</td>' +
					'</tr>');
			}
		}
	});
}
