$(".button-collapse").sideNav();

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
		data: JSON.stringify({"dest": 5, "operation": 1}),
		success: function(response) {
			var data = [[], [], [], []];
			for (var i = 0; i < response.length; i++) {
				var resYear = response[i].date.year,
					resMonth = response[i].date.month,
					resDay = response[i].date.day;

				if (resYear == year && resMonth == month) {
					//Check If The Data Of Current Day Had Been Set
					var dup = data[2].filter(function(obj) { return obj.x == resDay; });
					//Create A New Array Element With Current Data And Date
					dup.length == 0 ? data[2].push({ x: resDay, y: response[i].income, label: resDay }) :
					//Or Add Current Data With Previous One Of The Same Date
					data[2][data[2].map(function(d) { return d['x']; }).indexOf(dup[0].x)].y += response[i].income;

					var dup = data[3].filter(function(obj) { return obj.x == resDay; });
					dup.length == 0 ? data[3].push({ x: resDay, y: response[i].expenditure, label: resDay }) :
					data[3][data[3].map(function(d) { return d['x']; }).indexOf(dup[0].x)].y += response[i].expenditure;

					if (resDay == day) {
						//Add Income And Expenditure Data Of Current Date
						response[i].income != 0 ?
						data[0].push({y: response[i].income, indexLabel: response[i].name}) : '';

						response[i].expenditure != 0 ?
						data[1].push({y: response[i].expenditure, indexLabel: response[i].name}) : '';
					}
				}
			}

			$("#loading").hide();
			for (var i = 0; i < 4; i++) {
				//Set Data To Charts And Render Them
				chart[i].options.title.fontWeight = 'normal';
				chart[i].options.data[0].dataPoints = data[i];
				chart[i].render();
			}
		}
	});
});
