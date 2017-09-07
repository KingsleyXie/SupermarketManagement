$(".button-collapse").sideNav();

var date = new Date(),
	year = date.getFullYear(),
	month = date.getMonth() + 1,
	day = date.getDate();

var chart = [
	new CanvasJS.Chart("chart0", {
		title: { text: year + '年' + month + '月' + day + '日收入报表' },
		subtitles: [{
			text: '（暂无当天收入数据）',
			fontSize: 30,
			verticalAlign: 'center'
		}],
		data: [{
			type: 'doughnut',
			dataPoints: []
		}]
	}),

	new CanvasJS.Chart("chart1", {
		title: { text: year + '年' + month + '月' + day + '日支出报表' },
		subtitles: [{
			text: '（暂无当天支出数据）',
			fontSize: 30,
			verticalAlign: 'center'
		}],
		data: [{
			type: 'doughnut',
			dataPoints: []
		}]
	}),

	'',

	new CanvasJS.Chart("chart3", {
		zoomEnabled:true,
		title: { text: year + '年' + month + '月收入报表' },
		data: [{
			type: 'column',
			indexLabel: "{y}",
			dataPoints: []
		}]
	}),

	new CanvasJS.Chart("chart4", {
		zoomEnabled:true,
		title: { text: year + '年' + month + '月支出报表' },
		data: [{
			type: 'column',
			indexLabel: "{y}",
			dataPoints: []
		}]
	})
];

$(document).ready(function() {
	$.ajax({
		type: 'POST',
		url: './assets/API/api.cgi',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({"dest": 5, "operation": 1}),
		success: function(response) {
			//Initialize Data Of Monthly Report Chart
			for (var i = 1; i <= day; i++) {
				chart[3].options.data[0].dataPoints.push({ x: i, y: 0, label: i });
				chart[4].options.data[0].dataPoints.push({ x: i, y: 0, label: i });
			}

			for (var i = 0; i < response.length; i++) {
				var resYear = response[i].date.year,
					resMonth = response[i].date.month,
					resDay = response[i].date.day;

				if (resYear == year && resMonth == month) {
					//Summarize Monthly Report Data
					chart[3].options.data[0].dataPoints[resDay - 1].y += response[i].income;
					chart[4].options.data[0].dataPoints[resDay - 1].y += response[i].expenditure;

					if (resDay == day) {
						//Add Income And Expenditure Data Of Current Date
						response[i].income != 0 ?
						chart[0].options.data[0].dataPoints.push({ y: response[i].income, indexLabel: response[i].name }) : '';

						response[i].expenditure != 0 ?
						chart[1].options.data[0].dataPoints.push({ y: response[i].expenditure, indexLabel: response[i].name }) : '';						
					}
				}
			}

			if (chart[0].options.data[0].dataPoints.length)
				chart[0].options.subtitles[0].text = '';
			if (chart[1].options.data[0].dataPoints.length)
				chart[1].options.subtitles[0].text = '';

			$("#loading").hide();
			for (let i = 0; i < 5; i++) {
				if (i == 2) i++;
				//Set Data To Charts And Render Them
				chart[i].options.animationEnabled = true;
				chart[i].options.title.fontWeight = 'normal';
				$("#chart" + i).one('inview', function(event, isInView) {
					if (isInView) {
						chart[i].render();
					}
				});
			}
		}
	});
});
