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
		},
		{
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
		},
		{
			type: 'line',
			color: '#ff7043',
			showInLegend: true,
			legendText: '支出金额',
			dataPoints: []
		},
		{
			type: 'line',
			color: '#42a5f5',
			showInLegend: true,
			legendText: '总金额',
			dataPoints: []
		}]
	}),
];

$(document).ready(function() {
	//Use 'dp' Function to Make Access Of 'dataPoints' More Convenient
	function dp(chartIndex, dataIndex) {
		return chart[chartIndex].options.data[dataIndex].dataPoints;
	}

	$.post(
		'./assets/API/api.cgi',
		JSON.stringify({"destination": 5, "operation": 1}),
		function(response) {
			//Initialize Data Of Monthly Report Chart
			for (var i = 1; i <= day; i++) {
				new Array(dp(3,0), dp(4,0), dp(5,0), dp(5,1), dp(5,2)).
				forEach(function(d) {
					d.push({ x: i, y: 0, label: i });
				})
			}

			$.each(response, function(i, f) {
				//Iterate Each Finance Data As 'f'
				if (f.date.year == year && f.date.month == month) {
					//Summarize Monthly Report Data
					dp(3, 0)[f.date.day - 1].y += f.income;
					dp(4, 0)[f.date.day - 1].y += f.expenditure;
					dp(5, 0)[f.date.day - 1].y += f.income;
					dp(5, 1)[f.date.day - 1].y += f.expenditure;
					dp(5, 2)[f.date.day - 1].y += (f.income - f.expenditure);

					if (f.date.day == day) {
						//Add Income And Expenditure Data Of Current Date
						f.income != 0 ?
						dp(0, 0).push({ y: f.income, indexLabel: f.name }) : '';

						f.expenditure != 0 ?
						dp(1, 0).push({ y: f.expenditure, indexLabel: f.name }) : '';						
					
						dp(2, 0).push({ y: f.income, label: f.name });
						dp(2, 1).push({ y: f.expenditure, label: f.name });
					}
				}
			});

			if (dp(0, 0).length) chart[0].options.subtitles[0].text = '';
			if (dp(1, 0).length) chart[1].options.subtitles[0].text = '';
			if (dp(2, 0).length || dp(2, 1).length)
				chart[2].options.subtitles[0].text = '';

			$("#loading").hide();
			for (var i = 0; i < 6; i++) {
				//Set Data To Charts And Render Them
				chart[i].options.animationEnabled = true;
				chart[i].options.title.fontWeight = 'normal';
				(function(i){
					$("#chart" + i).one('inview', function(event, isInView) {
						if (isInView) {
							chart[i].render();
						}
					});
				})(i);
			}
		}
	);
});
