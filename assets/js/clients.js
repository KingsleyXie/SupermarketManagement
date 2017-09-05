$(".modal").modal();
$("select").material_select();
$(".button-collapse").sideNav();

function suppliersPY() {
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({"dest": 5, "operation": 2}),
		success: function(response) {
			$("#display").hide(600);
			setTimeout(function () {
				$("#display").html('');
				for (var index = 0; index < response.suppliers.length; index++) {
					$("#display").append(
					'<div class="card">' +
						'<div class="card-content">' +
							'<table class="highlight">' +
								'<thead>' +
									'<tr>' +
										'<th>序号</th>' +
										'<th>供货商名称</th>' +
									'</tr>' +
								'</thead>' +
								'<tbody>' +
									'<tr>' +
										'<td>' + index + '</td>' +
										'<td>' + response.suppliers[index].supplier + '</td>' +
									'</tr>' +
								'</tbody>' +
							'</table>' +
							'<div class="card-content subtable">' +
								'<table class="highlight responsive-table">' +
									'<thead>' +
										'<tr>' +
											'<th>交易时间</th>' +
											'<th>商品ID</th>' +
											'<th>商品名称</th>' +
											'<th>商品数量</th>' +
											'<th>商品单价</th>' +
										'</tr>' +
									'</thead>' +
									'<tbody id="py-details' + index + '"></tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>');
					for (var i = 0; i < response.suppliers[index].transaction.length; i++) {
						$("#py-details" + index).append(
						'<tr>' +
							'<td>' + response.suppliers[index].transaction[i].transactionTime + '</td>' +
							'<td>' + response.suppliers[index].transaction[i].itemID + '</td>' +
							'<td>' + response.suppliers[index].transaction[i].itemName + '</td>' +
							'<td>' + response.suppliers[index].transaction[i].itemAmount + '</td>' +
							'<td>' + response.suppliers[index].transaction[i].itemPrice + '</td>' +
						'</tr>');
					}
				}
			}, 600);
			$("#display").show(700);
		}
	});
}

function customersPY() {
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({"dest": 5, "operation": 2}),
		success: function(response) {
			$("#display").hide(600);
			setTimeout(function () {
				$("#display").html('');
				for (var index = 0; index < response.customers.length; index++) {
					$("#display").append(
					'<div class="card">' +
						'<div class="card-content">' +
							'<table class="highlight">' +
								'<thead>' +
									'<tr>' +
										'<th>序号</th>' +
										'<th>客户名称</th>' +
										'<th>会员卡号</th>' +
										'<th>当前积分</th>' +
									'</tr>' +
								'</thead>' +
								'<tbody>' +
									'<tr>' +
										'<td>' + index + '</td>' +
										'<td>' + response.customers[index].customerName + '</td>' +
										'<td>' + response.customers[index].customerNo + '</td>' +
										'<td>' + response.customers[index].totalPoints + '</td>' +
									'</tr>' +
								'</tbody>' +
							'</table>' +
							'<div class="card-content subtable">' +
								'<table class="highlight responsive-table">' +
									'<thead>' +
										'<tr>' +
											'<th>购物时间</th>' +
											'<th>付款</th>' +
											'<th>积分</th>' +
										'</tr>' +
									'</thead>' +
									'<tbody id="py-details' + index + '"></tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>');
					for (var i = 0; i < response.customers[index].purchases.length; i++) {
						$("#py-details" + index).append(
						'<tr>' +
							'<td>' + response.customers[index].purchases[i].purchaseTime + '</td>' +
							'<td>' + response.customers[index].purchases[i].payment + '</td>' +
							'<td>' + response.customers[index].purchases[i].points + '</td>' +
						'</tr>');
					}
				}
			}, 600);
			$("#display").show(700);
		}
	});
}
