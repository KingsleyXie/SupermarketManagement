function suppliersPY() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 5, "operation": 2}),
		function(response) {
			$("#display").hide(600);
			setTimeout(function () {
				$("#display").html('');
				$.each(response.suppliers, function(index, supplier) {
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
										'<td>' + supplier.supplier + '</td>' +
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
					$.each(supplier.transaction, function(i, transaction) {
						$("#py-details" + index).append(
						'<tr>' +
							'<td>' + transaction.transactionTime + '</td>' +
							'<td>' + transaction.itemID + '</td>' +
							'<td>' + transaction.itemName + '</td>' +
							'<td>' + transaction.itemAmount + '</td>' +
							'<td>' + transaction.itemPrice + '</td>' +
						'</tr>');
					});
				});
			}, 600);
			$("#display").show(700);
		}
	)

	.fail(function() {
		Materialize.toast('获取数据出错', 3000);
	});
}

function customersPY() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 5, "operation": 2}),
		function(response) {
			$("#display").hide(600);
			setTimeout(function () {
				$("#display").html('');
				$.each(response.customers, function(index, customer) {
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
										'<td>' + customer.customerName + '</td>' +
										'<td>' + customer.customerNo + '</td>' +
										'<td>' + customer.totalPoints + '</td>' +
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
					$.each(customer.purchases, function(i, purchase) {
						$("#py-details" + index).append(
						'<tr>' +
							'<td>' + purchase.purchaseTime + '</td>' +
							'<td>' + purchase.payment + '</td>' +
							'<td>' + purchase.points + '</td>' +
						'</tr>');
					});
				});
			}, 600);
			$("#display").show(700);
		}
	)

	.fail(function() {
		Materialize.toast('获取数据出错', 3000);
	});
}
