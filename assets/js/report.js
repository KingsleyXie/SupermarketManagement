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

	new CanvasJS.Chart("chart2", {
		zoomEnabled:true,
		title: { text: year + '年' + month + '月' + day + '日财务报表' },
		subtitles: [{
			text: '（暂无当天财务数据）',
			fontSize: 30,
			verticalAlign: 'center'
		}],
		data: [{
			type: 'column',
			color: '#00e5ff',
			showInLegend: true,
			legendText: '收入金额',
			indexLabel: "{y}",
			dataPoints: []
		}, {
			type: 'column',
			color: '#ff7043',
			showInLegend: true,
			legendText: '支出金额',
			indexLabel: "{y}",
			dataPoints: []
		}]
	}),

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
	}),

	new CanvasJS.Chart("chart5", {
		zoomEnabled:true,
		title: { text: year + '年' + month + '月财务报表' },
		data: [{
			type: 'line',
			color: '#00e5ff',
			showInLegend: true,
			legendText: '收入金额',
			dataPoints: []
		}, {
			type: 'line',
			color: '#ff7043',
			showInLegend: true,
			legendText: '支出金额',
			dataPoints: []
		}, {
			type: 'line',
			color: '#42a5f5',
			showInLegend: true,
			legendText: '总金额',
			dataPoints: []
		}]
	}),
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
				dataPoints(3, 0).push({ x: i, y: 0, label: i });
				dataPoints(4, 0).push({ x: i, y: 0, label: i });
				dataPoints(5, 0).push({ x: i, y: 0, label: i });
				dataPoints(5, 1).push({ x: i, y: 0, label: i });
				dataPoints(5, 2).push({ x: i, y: 0, label: i });
			}

			for (var i = 0; i < response.length; i++) {
				var resYear = response[i].date.year,
					resMonth = response[i].date.month,
					resDay = response[i].date.day;

				if (resYear == year && resMonth == month) {
					//Summarize Monthly Report Data
					dataPoints(3, 0)[resDay - 1].y += response[i].income;
					dataPoints(5, 0)[resDay - 1].y += response[i].income;
					dataPoints(4, 0)[resDay - 1].y += response[i].expenditure;
					dataPoints(5, 1)[resDay - 1].y += response[i].expenditure;
					dataPoints(5, 2)[resDay - 1].y += response[i].income - response[i].expenditure;

					if (resDay == day) {
						//Add Income And Expenditure Data Of Current Date
						response[i].income != 0 ?
						dataPoints(0, 0).push({ y: response[i].income, indexLabel: response[i].name }) : '';

						response[i].expenditure != 0 ?
						dataPoints(1, 0).push({ y: response[i].expenditure, indexLabel: response[i].name }) : '';						
					
						dataPoints(2, 0).push({ y: response[i].income, label: response[i].name });
						dataPoints(2, 1).push({ y: response[i].expenditure, label: response[i].name });
					}
				}
			}

			if (dataPoints(0, 0).length) chart[0].options.subtitles[0].text = '';
			if (dataPoints(1, 0).length) chart[1].options.subtitles[0].text = '';
			if (dataPoints(2, 0).length || dataPoints(2, 1).length)
				chart[2].options.subtitles[0].text = '';

			$("#loading").hide();
			for (let i = 0; i < 6; i++) {
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

function dataPoints(chartIndex, dataIndex) {
	return chart[chartIndex].options.data[dataIndex].dataPoints;
}