var data = {};
data["dest"] = 5; data["operation"] = 2;
data = JSON.stringify(data);

$(".button-collapse").sideNav();
$('.modal').modal();
$('select').material_select();

function suppliersPY() {
	$.ajax({
		type: "POST",
		url: "./assets/API/api.cgi",
		contentType: "application/json; charset=utf-8",
		data: data,
		dataType: "json",
		success: function(response)
		{
			document.getElementById("display").innerHTML = "";

			for (var index = 0; index <= response.suppliers.length - 1; index++) {
				document.getElementById("display").innerHTML += 
					"<div class=\"card\">" + 
						"<div class=\"card-content\">" + 
							"<table class=\"responsive-table\">" + 
								"<thead>" + 
									"<tr>" + 
										"<th>序号</th>" + 
										"<th>供货商名称</th>" + 
									"</tr>" + 
								"</thead>" + 
								"<tbody>" + 
									"<tr>" + 
										"<td>" + index + "</td>" + 
										"<td>" + response.suppliers[index].supplier + "</td>" + 
									"</tr>" + 
								"</tbody>" + 
							"</table>" + 
							"<div class=\"card-content\">" + 
								"<table class=\"highlight responsive-table\">" + 
									"<thead>" + 
										"<tr>" + 
											"<th>交易时间</th>" + 
											"<th>商品ID</th>" + 
											"<th>商品名称</th>" + 
											"<th>商品数量</th>" + 
											"<th>商品单价</th>" + 
										"</tr>" + 
									"</thead>" + 
									"<tbody id=\"py-details" + index + "\">" + 
									"</tbody>" + 
								"</table>" + 
							"</div>" + 
						"</div>" + 
					"</div>";
				for (var i = 0; i < response.suppliers[index].transaction.length; i++) {
					document.getElementById("py-details" + index).innerHTML += 
						"<tr>" + 
							"<td>" + response.suppliers[index].transaction[i].transactionTime + "</td>" + 
							"<td>" + response.suppliers[index].transaction[i].itemID + "</td>" + 
							"<td>" + response.suppliers[index].transaction[i].itemName + "</td>" + 
							"<td>" + response.suppliers[index].transaction[i].itemAmount + "</td>" + 
							"<td>" + response.suppliers[index].transaction[i].itemPrice + "</td>" + 
						"</tr>";
				}
			}
		}
	});
}

function customersPY() {
	$.ajax({
		type: "POST",
		url: "./assets/API/api.cgi",
		contentType: "application/json; charset=utf-8",
		data: data,
		dataType: "json",
		success: function(response)
		{
			document.getElementById("display").innerHTML = "";

			for (var index = 0; index <= response.customers.length - 1; index++) {
				document.getElementById("display").innerHTML += 
					"<div class=\"card\">" + 
						"<div class=\"card-content\">" + 
							"<table class=\"responsive-table\">" + 
								"<thead>" + 
									"<tr>" + 
										"<th>序号</th>" + 
										"<th>客户名称</th>" + 
										"<th>会员卡号</th>" + 
										"<th>当前积分</th>" + 
									"</tr>" + 
								"</thead>" + 
								"<tbody>" + 
									"<tr>" + 
										"<td>" + index + "</td>" + 
										"<td>" + response.customers[index].customerName + "</td>" + 
										"<td>" + response.customers[index].customerNo + "</td>" + 
										"<td>" + response.customers[index].totalPoints + "</td>" + 
									"</tr>" + 
								"</tbody>" + 
							"</table>" + 
							"<div class=\"card-content\">" + 
								"<table class=\"highlight responsive-table\">" + 
									"<thead>" + 
										"<tr>" + 
											"<th>购物时间</th>" + 
											"<th>付款</th>" + 
											"<th>积分</th>" + 
										"</tr>" + 
									"</thead>" + 
									"<tbody id=\"py-details" + index + "\">" + 
									"</tbody>" + 
								"</table>" + 
							"</div>" + 
						"</div>" + 
					"</div>";
				for (var i = 0; i < response.customers[index].purchases.length; i++) {
					document.getElementById("py-details" + index).innerHTML += 
						"<tr>" + 
							"<td>" + response.customers[index].purchases[i].purchaseTime + "</td>" + 
							"<td>" + response.customers[index].purchases[i].payment + "</td>" + 
							"<td>" + response.customers[index].purchases[i].points + "</td>" + 
						"</tr>";
				}
			}
		}
	});
}
