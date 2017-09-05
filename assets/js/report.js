var chart1 = new CanvasJS.Chart("chart1", {
	animationEnabled: true,
	title: {
		text: '日报表 - 收入部分',
		fontFamily: 'Impact',
		fontWeight: 'normal'
	},
	legend: {
		verticalAlign: 'bottom',
		horizontalAlign: 'center'
	},
	data: [{
		indexLabelFontSize: 20,
		indexLabelFontFamily: 'Garamond',
		indexLabelFontColor: 'darkgrey',
		indexLabelLineColor: 'darkgrey',
		indexLabelPlacement: 'outside',
		type: 'doughnut',
		showInLegend: true,
		legendText: '{indexLabel}',
		dataPoints: []
	}]
});

var chart2 = new CanvasJS.Chart("chart2", {
	animationEnabled: true,
	title: {
		text: '日报表 - 支出部分',
		fontFamily: 'Impact',
		fontWeight: 'normal'
	},
	legend: {
		verticalAlign: 'bottom',
		horizontalAlign: 'center'
	},
	data: [{
		indexLabelFontSize: 20,
		indexLabelFontFamily: 'Garamond',
		indexLabelFontColor: 'darkgrey',
		indexLabelLineColor: 'darkgrey',
		indexLabelPlacement: 'outside',
		type: 'doughnut',
		showInLegend: true,
		legendText: '{indexLabel}',
		dataPoints: []
	}]
});

var chart3 = new CanvasJS.Chart("chart3", {
	animationEnabled: true,
	title: {
		text: '月报表 - 收入部分'
	},
	data: [{
		type: 'column',
		dataPoints: []
	}]
});

var chart4 = new CanvasJS.Chart("chart4", {
	animationEnabled: true,
	title: {
		text: '月报表 - 支出部分'
	},
	data: [{
		type: 'column',
		dataPoints: []
	}]
});



$(".button-collapse").sideNav();

var date = new Date();
var month = date.getMonth() + 1, day = date.getDate();

var data = {};
data["dest"] = 5; data["operation"] = 1;
data = JSON.stringify(data);



$(document).ready(function() {
	document.getElementById("loading").style.display = "flex";

	$.ajax({
		type: "POST",
		url: "./assets/API/api.cgi",
		contentType: "application/json; charset=utf-8",
		data: data,
		dataType: "json",
		success: function(response)
		{
			var data1 = new Array(), data2 = new Array(), data3 = new Array(), data4 = new Array();

			for (var i = 0; i <= response.length - 1; i++) {
				if (response[i].date.day == day) {
					data1.push({  y: response[i].income, indexLabel: response[i].name });
					data2.push({  y: response[i].expenditure, indexLabel: response[i].name });
				}

				if (response[i].date.month == month) {
					var dup = data3.filter(function(obj) {
						return obj.x == response[i].date.day;
					});

					if (dup.length == 0) {
						data3.push({ x: response[i].date.day, y: parseFloat(response[i].income), label: response[i].date.day });
					}
					else {
						data3[data3.map(function(d) { return d['x']; }).indexOf(dup[0].x)].y += parseFloat(response[i].income);
					}



					var dup = data4.filter(function(obj) {
						return obj.x == response[i].date.day;
					});

					if (dup.length == 0) {
						data4.push({ x: response[i].date.day, y: parseFloat(response[i].expenditure), label: response[i].date.day });
					}
					else {
						data4[data4.map(function(d) { return d['x']; }).indexOf(dup[0].x)].y += parseFloat(response[i].expenditure);
					}
				}
			}

			document.getElementById("loading").style.display = "none";

			chart1.options.data[0].dataPoints = data1; chart1.render();
			chart2.options.data[0].dataPoints = data2; chart2.render();
			chart3.options.data[0].dataPoints = data3; chart3.render();
			chart4.options.data[0].dataPoints = data4; chart4.render();
		}
	});
});
