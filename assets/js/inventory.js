$("#loading").css('display', 'flex');
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
						$("input").val('');
						$("select").val(0).material_select();
						$("label").removeClass("active");
					}, 2000);
				}
			}
		});
	});
});

function inputData() {
	document.getElementById("add-init").style.display = "none";
	document.getElementById("item-info").style.display = "block";
}

function getData() {
	document.getElementById("progress").style.display = "block";
	var barcode = document.getElementById("barcode").value;
	$.ajax({
      type: "GET",
      url: 'http://jisutxmcx.market.alicloudapi.com/barcode2/query',
      headers: 
      {
        'Authorization':'APPCODE your_APPCODE_here'
        // Add your APPCODE here, you can get it on
        // https://market.aliyun.com/products/56928004/cmapi011806.html
      },
      data: 'barcode=' + barcode,
      success: function(response) {
      	if (response.status == 0) {
				document.getElementById("brand").value = response.result.brand;
				document.getElementById("name").value = response.result.name;
				document.getElementById("unspsc").value = response.result.unspsc;
				document.getElementById("type").value = response.result.type;
				document.getElementById("price").value = response.result.price;

				window.setTimeout(function ()
				{
					document.getElementById("inventory-quantity").focus();
				}, 0);

				document.getElementById("progress").style.display = "none";
				document.getElementById("add-init").style.display = "none";
				document.getElementById("item-info").style.display = "block";
			}},
		error: function() {
			Materialize.toast("未找到商品信息，请手动录入数据", 3000);
			document.getElementById("progress").style.display = "none";
			document.getElementById("add-init").style.display = "none";
			document.getElementById("item-info").style.display = "block";
		}
	});
}

function update() {
	modifying = true;
	var info = document.getElementById("ID" + document.getElementById("itemID").value).cells;

	document.getElementById("inventory-header").textContent = "修改货物信息";
	document.getElementById("btn-inventory").textContent = "确认修改";
	
	document.getElementById("brand").value = info[2].textContent;
	document.getElementById("name").value = info[3].textContent;
	document.getElementById("unspsc").value = info[4].textContent;
	document.getElementById("type").value = info[5].textContent;
	document.getElementById("price").value = info[6].textContent;
	document.getElementById("sale-price").value = info[7].textContent;
	document.getElementById("inventory-quantity").value = info[8].textContent;

	$('#expired-time').pickadate('picker').set('select', info[10].textContent).trigger("change");

	$("#search").modal("close");
	$("#inventory").modal("open");
	inputData();

	setTimeout(function () {
		$("#inventory-quantity").focus();
	}, 0);
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
				'<tr id="ID' + i + '">' +
					'<th>' + i + '</th>' + 
					'<th>' + response[i].barcode + '</th>' + 
					'<th>' + response[i].brand + '</th>' + 
					'<th>' + response[i].name + '</th>' + 
					'<th>' + response[i].unspsc + '</th>' + 
					'<th>' + response[i].type + '</th>' + 
					'<th>' + response[i].price + '</th>' + 
					'<th>' + response[i].salePrice + '</th>' + 
					'<th>' + response[i].inventoryQuantity + '</th>' + 
					'<th>' + response[i].threshold + '</th>' + 
					'<th>' + response[i].expiredTime + '</th>' + 
					'<th>' + response[i].importTime + '</th>' + 
					'<th>' + response[i].updateTime + '</th>' + 
				'</tr>');
				if (response[i].inventoryQuantity < response[i].threshold) {
					$("#ID" + i).addClass("red lighten-1");
				}
			}
		}
	});
}
