$(".button-collapse").sideNav();

var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate();

var chart = [
	new CanvasJS.Chart("chart1", {
		animationEnabled: true,
		title: { text: year + '年' + month + '月' + day + '日收入报表' },
		subtitles: [{
			text: '（暂无当天收入数据）',
			fontSize: 30,
			verticalAlign: 'center'
		}],
		data: [{ type: 'doughnut' }]
	}),

	new CanvasJS.Chart("chart2", {
		animationEnabled: true,
		title: { text: year + '年' + month + '月' + day + '日支出报表' },
		subtitles: [{
			text: '（暂无当天支出数据）',
			fontSize: 30,
			verticalAlign: 'center'
		}],
		data: [{ type: 'doughnut' }]
	}),

	new CanvasJS.Chart("chart3", {
		title: { text: year + '年' + month + '月收入报表' },
		data: [{ type: 'column' }]
	}),

	new CanvasJS.Chart("chart4", {
		title: { text: year + '年' + month + '月支出报表' },
		data: [{ type: 'column' }]
	})
];

$(document).ready(function() {
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({"dest": 5, "operation": 1}),
		success: function(response) {
			//Initialize `data` Array and Data Of Monthly Report Chart
			var data = [[], [], [], []];
			for (var i = 1; i <= day; i++) {
				data[2].push({ x: i, y: 0, label: i });
				data[3].push({ x: i, y: 0, label: i });
			}

			for (var i = 0; i < response.length; i++) {
				var resYear = response[i].date.year,
					resMonth = response[i].date.month,
					resDay = response[i].date.day;

				if (resYear == year && resMonth == month) {
					//Summarize Monthly Report Data
					data[2][resDay - 1].y += response[i].income;
					data[3][resDay - 1].y += response[i].expenditure;

					if (resDay == day) {
						//Add Income And Expenditure Data Of Current Date
						response[i].income != 0 ?
						data[0].push({ y: response[i].income, indexLabel: response[i].name }) : '';

						response[i].expenditure != 0 ?
						data[1].push({ y: response[i].expenditure, indexLabel: response[i].name }) : '';
					}
				}
			}

			if (data[0].length) chart[0].options.subtitles[0].text = '';
			if (data[1].length) chart[1].options.subtitles[0].text = '';

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
