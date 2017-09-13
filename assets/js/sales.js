$(".modal").modal();
$("select").material_select();
$(".button-collapse").sideNav();

var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate(),
	time = year + '-' + month + '-' + day;

$("#sell").submit(function(e) {
	e.preventDefault();

	data = {"dest": 1, "operation": 1, "year": year, "month": month, "day": day, "time": time};
	$(this).serializeArray().map(function(x){data[x.name] = parseInt(x.value);}); 
	data = JSON.stringify(data);

	$.post(
		'./assets/API/api.cgi',
		data,
		function(response) {
			if (response.code == 0) {
				Materialize.toast('购物记录添加成功！', 2000);
				setTimeout(function () {
					$("#sell").modal('close');
				}, 1700);
			}
		}
	)

	.fail(function() {
		Materialize.toast('操作失败', 3000);
	});
});

$("#return").submit(function(e) {
	e.preventDefault();

	data = {"dest": 1, "operation": 2, "year": year, "month": month, "day": day, "time": time};
	$(this).serializeArray().map(function(x){data[x.name] = parseInt(x.value);});
	data = JSON.stringify(data);

	$.post(
		'./assets/API/api.cgi',
		data,
		function(response) {
			if (response.code == 0) {
				Materialize.toast('退货记录添加成功！', 2000);
				window.setTimeout(function () {
					$("#return").modal('close');
				}, 1700);
			}
		}
	)

	.fail(function() {
		Materialize.toast('操作失败', 3000);
	});
});
