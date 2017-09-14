limitSet();

$("#sell").submit(function(e) {
	e.preventDefault();

	data = {
		"destination": 1,
		"operation": 1,
		"year": year,
		"month": month,
		"day": day,
		"time": time
	};
	$(this).serializeArray().map(function(x){data[x.name] = parseInt(x.value);}); 
	data = JSON.stringify(data);

	$.post(
		'./assets/API/api.cgi',
		data,
		function(response) {
			if (response.code == 0) {
				Materialize.toast('购物记录添加成功！', 2000);
				limitSet();
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

	data = {
		"destination": 1,
		"operation": 2,
		"year": year,
		"month": month,
		"day": day,
		"time": time
	};
	$(this).serializeArray().map(function(x){data[x.name] = parseInt(x.value);});
	data = JSON.stringify(data);

	$.post(
		'./assets/API/api.cgi',
		data,
		function(response) {
			if (response.code == 0) {
				Materialize.toast('退货记录添加成功！', 2000);
				limitSet();
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

function limitSet() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 1, "operation": 3}),
		function(response) {
			$('[name="itemID"]').attr("max", response.items - 1)
			$('[name="customerID"]').attr("max", response.customers - 1)
		}
	);
}
