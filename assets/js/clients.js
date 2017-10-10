function suppliers() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 5, "operation": 2}),
		function(response) {
			$("#display").hide(600);
			setTimeout(function () {
				$("#display").html('');
				$.each(response, function(i, supplier) {
					$("#display").append(
					'<div class="card">' +
						'<div class="card-content" id="table' + i + '">' +
							'<table class="highlight">' +
								'<thead>' +
									'<tr>' +
										'<th>序号</th>' +
										'<th>供货商名称</th>' +
									'</tr>' +
								'</thead>' +
								'<tbody>' +
									'<tr>' +
										'<td>' + i + '</td>' +
										'<td>' + supplier.supplierName + '</td>' +
									'</tr>' +
								'</tbody>' +
							'</table>' +
						'</div>' +
					'</div>');

					if (supplier.transactions.length) {
						$("#table" + i).append(
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
								'<tbody id="subtable' + i + '"></tbody>' +
							'</table>' +
						'</div>');
					}

					$.each(supplier.transactions, function(t, transaction) {
						$("#subtable" + i).append(
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

	$("#loading").hide();
}

function customers() {
	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 5, "operation": 3}),
		function(response) {
			$("#display").hide(600);
			setTimeout(function () {
				$("#display").html('');
				$.each(response, function(i, customer) {
					$("#display").append(
					'<div class="card">' +
						'<div class="card-content" id="table' + i + '">' +
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
										'<td>' + i + '</td>' +
										'<td>' + customer.customerName + '</td>' +
										'<td>' + customer.customerNo + '</td>' +
										'<td>' + customer.totalPoints + '</td>' +
									'</tr>' +
								'</tbody>' +
							'</table>' +
						'</div>' +
					'</div>');

					if (customer.purchases.length) {
						$("#table" + i).append(
						'<div class="card-content subtable">' +
							'<table class="highlight responsive-table">' +
								'<thead>' +
									'<tr>' +
										'<th>购物时间</th>' +
										'<th>付款</th>' +
										'<th>积分</th>' +
									'</tr>' +
								'</thead>' +
								'<tbody id="subtable' + i + '"></tbody>' +
							'</table>' +
						'</div>');
					}

					$.each(customer.purchases, function(t, purchase) {
						$("#subtable" + i).append(
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

	$("#loading").hide();
}
