display(); $("#loading").hide();
var modifying = false;

var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate(),
	time = year + '-' + month + '-' + day;

$(document).ready(function() {
	$(".modal").modal();
	$("select").material_select();
	$(".button-collapse").sideNav();
	$(".datepicker").pickadate({
		selectMonths: true,
		selectYears: 15,
		format: 'yyyy-mm-dd'
	});

	$("#inventory").submit(function(e) {
		e.preventDefault();
		data = {
			"dest": 2,
			"operation": (modifying ? 3 : 2),
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

		$.ajax({
			type: 'POST',
			url: './assets/API/api.cgi',
			contentType: 'application/json; charset=utf-8',
			data: data,
			success: function(response) {
				if (response.code == 0) {
					Materialize.toast('货物信息' + (modifying ? '修改' : '添加') + '成功！', 1700);
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
					}, 2000);
				}
			}
		});
	});
});

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
				$("#price").val(response.result.price);
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

function update() {
	modifying = true;
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

function toggle() {
	$("#progress").hide();
	$("#add-init").hide(500);
	$("#item-info").show(500);
}

function display() {
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({"dest": 2, "operation": 1}),
		success: function(response) {
			$("#display").html('');
			for (var i = 0; i < response.length; i++) {
				$("#display").append(
				'<tr' + (response[i].inventoryQuantity > response[i].threshold ? '' : ' class="red lighten-1"') + '>' +
					'<td>' + i + '</td>' +
					'<td>' + response[i].barcode + '</td>' +
					'<td>' + response[i].brand + '</td>' +
					'<td>' + response[i].name + '</td>' +
					'<td>' + response[i].unspsc + '</td>' +
					'<td>' + response[i].type + '</td>' +
					'<td>' + response[i].price + '</td>' +
					'<td>' + response[i].salePrice + '</td>' +
					'<td>' + response[i].inventoryQuantity + '</td>' +
					'<td>' + response[i].threshold + '</td>' +
					'<td>' + response[i].expiredTime + '</td>' +
					'<td>' + response[i].importTime + '</td>' +
					'<td>' + response[i].updateTime + '</td>' +
				'</tr>');
			}
		}
	});
}
