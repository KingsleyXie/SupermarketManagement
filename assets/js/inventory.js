$(document).ready(function() {
	display();
	limitSet();

	$("#inventory").submit(function(e) {
		e.preventDefault();
		
		data = {
			"destination": 2,
			"operation": (modifyingInv ? 3 : 2),
			"year": year,
			"month": month,
			"day": day,
			"time": time,
			"itemID": parseInt($("#itemID").val())
		};
		$(this).serializeArray().map(function(x){data[x.name] = x.value;});
		data["supplierID"] = parseInt(data["supplierID"]);
		data["inventoryQuantity"] = parseInt(data["inventoryQuantity"]);
		data["threshold"] = parseInt(data["threshold"]);
		data["price"] = parseFloat(data["price"]);
		data["salePrice"] = parseFloat(data["salePrice"]);
		data = JSON.stringify(data);

		$.post(
			'./assets/API/api.cgi',
			data,
			function(response) {
				if (response.code == 0) {
					Materialize.toast('货物信息' + (modifyingInv ? '修改' : '添加') + '成功！', 1700);
					setTimeout(function () {
						$("#inventory").modal('close');
						display();
						
						//Reset All Input Data
						$("#inventory-header").text('添加货物');
						$("#btn-inventory").text('确认添加');
						$("#item-info").hide();
						$("#add-init").show();
						$("input").val('');
						$("label").removeClass("active");
						limitSet();
					}, 2000);
				}
			}
		)

		.fail(function() {
			Materialize.toast('操作失败', 3000);
		});
	});
});

function getDataFromAPI() {
	$("#progress").show();
	$.post(
		'./assets/API/inventoryAPI.php',
		'barcode=' + $("#barcode").val(),
		function(response) {
			if (response.status == 0) {
				$("#brand").val(response.result.brand);
				$("#name").val(response.result.name);
				$("#unspsc").val(response.result.unspsc);
				$("#type").val(response.result.type);

				if (typeof response.result.price != 'undefined') {
					$("#price").val(response.result.price.replace('￥', ''));
				}

				$("label").addClass("active");

				toggle();
				window.setTimeout(function () {
					$("#inventory-quantity").focus();
				}, 0);
			} else {
				Materialize.toast("未找到商品信息，请手动录入数据", 1700);
				toggle();
			}
		}
	)

	.fail(function() {
		Materialize.toast("获取数据失败，请手动录入数据", 1700);
		toggle();
	});
}

/*
// Note: Following code is an old version API handler 
// which sends request and process the response data using Javascript only,
// if you don't like the current PHP version or can't run PHP code on your server
// you can uncomment this previous version and delete the same-name function above,
// and actually, the update of this function was intended to solve problem on https-only sites,
// after all, url of the API is `http` instead of `https`


function getDataFromAPI() {
	$("#progress").show();
	$.ajax({
		type: 'GET',
		url: 'http://jisutxmcx.market.alicloudapi.com/barcode2/query',
		headers: {
			'Authorization':'APPCODE your_APPCODE_here'
			// Add your APPCODE here, you can get it on
			// https://market.aliyun.com/products/56928004/cmapi011806.html
		},
		data: 'barcode=' + $("#barcode").val(),
		success: function(response) {
			if (response.status == 0) {
				$("#brand").val(response.result.brand);
				$("#name").val(response.result.name);
				$("#unspsc").val(response.result.unspsc);
				$("#type").val(response.result.type);

				if (typeof response.result.price != 'undefined') {
					$("#price").val(response.result.price.replace('￥', ''));
				}

				$("label").addClass("active");

				toggle();
				window.setTimeout(function () {
					$("#inventory-quantity").focus();
				}, 0);
			}
		},

		error: function() {
			Materialize.toast("未找到商品信息，请手动录入数据", 1700);
			toggle();
		}
	});
}
*/

function update() {
	modifyingInv = true;
	var info = $($("#display > tr")[$("#itemID").val()]).children();
	
	//Show Form In Modifying Mode
	$("#inventory-header").text('修改货物信息');
	$("#btn-inventory").text('确认修改');
	$("label").addClass("active");
	
	$("#brand").val(info[2].textContent);
	$("#name").val(info[3].textContent);
	$("#unspsc").val(info[4].textContent);
	$("#type").val(info[5].textContent);
	$("#price").val(info[6].textContent);
	$("#sale-price").val(info[7].textContent);
	$("#inventory-quantity").val(info[8].textContent);
	$("#threshold").val(info[9].textContent);

	$("#expired-time").pickadate('picker').set('select', info[10].textContent).trigger('change');

	$("#search").modal('close');
	$("#inventory").modal('open');
	toggle();

	setTimeout(function () {
		$("#inventory-quantity").focus();
	}, 0);
}

function display() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 2, "operation": 1}),
		function(response) {
			$("#display").html('');
			$("#itemID").attr("max", response.length - 1);
			$.each(response, function(i, inv) {
				$("#display").append(
				'<tr' + (inv.inventoryQuantity > inv.threshold ? '' : ' class="red lighten-1"') + '>' +
					'<td>' + i + '</td>' +
					'<td>' + inv.barcode + '</td>' +
					'<td>' + inv.brand + '</td>' +
					'<td>' + inv.name + '</td>' +
					'<td>' + inv.unspsc + '</td>' +
					'<td>' + inv.type + '</td>' +
					'<td>' + inv.price + '</td>' +
					'<td>' + inv.salePrice + '</td>' +
					'<td>' + inv.inventoryQuantity + '</td>' +
					'<td>' + inv.threshold + '</td>' +
					'<td>' + inv.expiredTime + '</td>' +
					'<td>' + inv.importTime + '</td>' +
					'<td>' + inv.updateTime + '</td>' +
				'</tr>');
			});
		}
	)

	.fail(function() {
		Materialize.toast('获取数据出错', 3000);
	});

	$("#loading").hide();
}

function limitSet() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 1, "operation": 3}),
		function(response) {
			$('[name="supplierID"]').attr("max", response.suppliers - 1)
		}
	);
}

function toggle() {
	$("#progress").hide();
	$("#add-init").hide(500);
	$("#item-info").show(500);
}
