var dest = 2, operation = 2, data = {};

var date = new Date();
var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
var time = year + "-" + month + "-" + day;

$(document).ready(function() {
	$('.button-collapse').sideNav();
	$('.modal').modal();
	$('select').material_select();
	$('.datepicker').pickadate({
    	selectMonths: true,
    	selectYears: 15,
    	format:'yyyy-mm-dd'
    });
	
	$('#add').submit(function(e) {
		e.preventDefault();
		data = {};
		$(this).serializeArray().map(function(x){data[x.name] = x.value;}); 
		data["dest"] = dest; data["operation"] = operation;
		data["year"] = year; data["month"] = month;
		data["day"] = day; data["time"] = time;
		data["itemID"] = parseInt(document.getElementById("itemID").value);
		data["supplierID"] = parseInt(data["supplierID"]);
		data["inventoryQuantity"] = parseInt(data["inventoryQuantity"]);
		data["threshold"] = parseInt(data["threshold"]);
		data["price"] = parseFloat(data["price"]);
		data["salePrice"] = parseFloat(data["salePrice"]);
		data = JSON.stringify(data);

		$.ajax({
			type: "POST",
			url: './assets/API/api.cgi',
			contentType: "application/json; charset=utf-8",
			data: data,
			dataType: "json",
			success: function(response)
			{
				if (response.code == 0) {
					if (operation == 2) {
						Materialize.toast("货物添加成功！", 3000);
					}
					if (operation == 3) {
						Materialize.toast("货物信息修改成功！", 3000);
					}

					window.setTimeout(function ()
					{
						window.location.href = "./inventory";
					}, 3600);
				}
			}
		});
	});

	data = {};
	data["dest"] = dest; data["operation"] = 1;
	data = JSON.stringify(data);

	$.ajax({
		type: "POST",
		url: "./assets/API/api.cgi",
		contentType: "application/json; charset=utf-8",
		data: data,
		dataType: "json",
		success: function(response)
		{
			for (var i = 0; i <= response.length - 1; i++) {
				document.getElementById("display").innerHTML += 
					"<tr id=\"ID" + i + "\">" +
						"<th>" + i + "</th>" + 
						"<th>" + response[i].barcode + "</th>" + 
						"<th>" + response[i].brand + "</th>" + 
						"<th>" + response[i].name + "</th>" + 
						"<th>" + response[i].unspsc + "</th>" + 
						"<th>" + response[i].type + "</th>" + 
						"<th>" + response[i].price + "</th>" + 
						"<th>" + response[i].salePrice + "</th>" + 
						"<th>" + response[i].inventoryQuantity + "</th>" + 
						"<th>" + response[i].threshold + "</th>" + 
						"<th>" + response[i].expiredTime + "</th>" + 
						"<th>" + response[i].importTime + "</th>" + 
						"<th>" + response[i].updateTime + "</th>" + 
					"</tr>";
				if (response[i].inventoryQuantity < response[i].threshold) {
					$("#ID" + i).addClass("red");
				}
			}
		}
	});
});


function inputData() {
	document.getElementById("addInit").style.display = "none";
	document.getElementById("itemInfo").style.display = "block";
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
      success: function(response)
      {
      	if (response.status == 0) {
				document.querySelector("#brand + label").className ="active";
				document.getElementById("brand").value = response.result.brand;
				document.querySelector("#name + label").className ="active";
				document.getElementById("name").value = response.result.name;
				document.querySelector("#unspsc + label").className ="active";
				document.getElementById("unspsc").value = response.result.unspsc;
				document.querySelector("#type + label").className ="active";
				document.getElementById("type").value = response.result.type;
				document.querySelector("#price + label").className ="active";
				document.getElementById("price").value = response.result.price;

				window.setTimeout(function ()
				{
					document.getElementById("inventoryQuantity").focus();
				}, 0);

				document.getElementById("progress").style.display = "none";
				document.getElementById("addInit").style.display = "none";
				document.getElementById("itemInfo").style.display = "block";
			}},
		error: function() {
			Materialize.toast("未找到商品信息，请手动录入数据", 3000);
			document.getElementById("progress").style.display = "none";
			document.getElementById("addInit").style.display = "none";
			document.getElementById("itemInfo").style.display = "block";
		}
	});
}

function update() {
	var info = document.getElementById("ID" + document.getElementById("itemID").value).cells;

	document.getElementById("inventoryHeader").textContent = "修改货物信息";
	document.getElementById("inventoryBtn").textContent = "确认修改";
	
	document.querySelector("#brand + label").className ="active";
	document.getElementById("brand").value = info[2].textContent;
	document.querySelector("#name + label").className ="active";
	document.getElementById("name").value = info[3].textContent;
	document.querySelector("#unspsc + label").className ="active";
	document.getElementById("unspsc").value = info[4].textContent;
	document.querySelector("#type + label").className ="active";
	document.getElementById("type").value = info[5].textContent;
	document.querySelector("#price + label").className ="active";
	document.getElementById("price").value = info[6].textContent;
	document.querySelector("#salePrice + label").className ="active";
	document.getElementById("salePrice").value = info[7].textContent;
	document.querySelector("#inventoryQuantity + label").className ="active";
	document.getElementById("inventoryQuantity").value = info[8].textContent;

	$('#expiredTime').pickadate('picker').set('select', info[10].textContent, { format: 'yyyy-mm-dd' }).trigger("change");

	$("#search").modal("close");
	$("#add").modal("open");
	inputData();

	window.setTimeout(function ()
	{
		document.getElementById("inventoryQuantity").focus();
	}, 0);

	operation = 3;
}
