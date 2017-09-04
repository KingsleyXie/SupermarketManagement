var dest = 1, data = {};

var date = new Date();
var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
var time = year + "-" + month + "-" + day;

$(".button-collapse").sideNav();
$('.modal').modal();
$('select').material_select();

$('#sell').submit(function(e) {
	e.preventDefault();
	data = {};
	$(this).serializeArray().map(function(x){data[x.name] = parseInt(x.value);}); 
	data["dest"] = dest; data["operation"] = 1; data["time"] = time;
	data["year"] = year; data["month"] = month; data["day"] = day;
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
				Materialize.toast("购物记录添加成功！", 3000);

				window.setTimeout(function ()
				{
					window.location.href = "./sales";
					$("#sell").modal("close");
				}, 3600);
			}
		}
	});
});

$('#return').submit(function(e) {
	e.preventDefault();
	data = {};
	$(this).serializeArray().map(function(x){data[x.name] = parseInt(x.value);}); 
	data["dest"] = dest; data["operation"] = 2; data["time"] = time;
	data["year"] = year; data["month"] = month; data["day"] = day;
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
				Materialize.toast("退货记录添加成功！", 3000);

				window.setTimeout(function ()
				{
					window.location.href = "./sales";
					$("#return").modal("close");
				}, 3600);
			}
		}
	});
});
