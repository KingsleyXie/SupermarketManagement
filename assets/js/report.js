$(".button-collapse").sideNav();
$("#loading").css('display', 'flex');

var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate();

var chart = [
	new CanvasJS.Chart("chart1", {
		animationEnabled: true,
		title: {text: year + '年' + month + '月' + day + '日收入报表'},
		data: [{type: 'doughnut'}]
	}),

	new CanvasJS.Chart("chart2", {
		animationEnabled: true,
		title: {text: year + '年' + month + '月' + day + '日支出报表'},
		data: [{type: 'doughnut'}]
	}),

	new CanvasJS.Chart("chart3", {
		title: {text: year + '年' + month + '月收入报表'},
		data: [{type: 'column'}]
	}),

	new CanvasJS.Chart("chart4", {
		title: {text: year + '年' + month + '月支出报表'},
		data: [{type: 'column'}]
	})
];

$(document).ready(function() {
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({'dest': 5, 'operation': 1}),
		success: function(response) {
			var data = [[], [], [], []];
			for (var i = 0; i <= response.length - 1; i++) {
				if (response[i].date.day == day) {
					data[0].push({  y: response[i].income, indexLabel: response[i].name });
					data[1].push({  y: response[i].expenditure, indexLabel: response[i].name });
				}

				if (response[i].date.month == month) {
					var dup = data[2].filter(function(obj) {
						return obj.x == response[i].date.day;
					});

					if (dup.length == 0) {
						data[2].push({ x: response[i].date.day, y: parseFloat(response[i].income), label: response[i].date.day });
					}
					else {
						data[2][data[2].map(function(d) { return d['x']; }).indexOf(dup[0].x)].y += parseFloat(response[i].income);
					}

					var dup = data[3].filter(function(obj) {
						return obj.x == response[i].date.day;
					});

					if (dup.length == 0) {
						data[3].push({ x: response[i].date.day, y: parseFloat(response[i].expenditure), label: response[i].date.day });
					}
					else {
						data[3][data[3].map(function(d) { return d['x']; }).indexOf(dup[0].x)].y += parseFloat(response[i].expenditure);
					}
				}
			}

			$("#loading").hide();
			for (var i = 0; i < 4; i++) {
				chart[i].options.title.fontWeight = 'normal';
				chart[i].options.data[0].dataPoints = data[i];
				chart[i].render();
			}
		}
	});
});
