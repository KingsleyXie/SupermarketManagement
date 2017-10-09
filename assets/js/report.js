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
		toolTip:{ shared: true },
		axisX:{
			labelFormatter: function(){return "";},
			tickLength: 0,
		},
		data: [{
			type: 'scatter',
			color: '#ff7043',
			name: '收入',
			showInLegend: true,
			legendText: '收入金额',
			dataPoints: []
		},
		{
			type: 'scatter',
			color: '#00e5ff',
			name: '支出',
			showInLegend: true,
			legendText: '支出金额',
			dataPoints: []
		},
		{
			type: 'line',
			markerType: "cross",
			markerSize: 5,
			lineDashType: "longDashDotDot",
			color: '#29b6f6',
			name: '小计',
			showInLegend: true,
			legendText: '小计',
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
		toolTip: { shared: true },
		data: [{
			type: 'splineArea',
			color: '#ff7043',
			name: '收入',
			showInLegend: true,
			legendText: '收入金额',
			dataPoints: []
		},
		{
			type: 'splineArea',
			color: '#00e5ff',
			name: '支出',
			showInLegend: true,
			legendText: '支出金额',
			dataPoints: []
		},
		{
			type: 'spline',
			markerType: "square",
			color: '#42a5f5',
			name: '总计',
			showInLegend: true,
			legendText: '总金额',
			indexLabel: '{y}',
			indexLabelFontColor: "#42a5f5",
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
				new Array(dp(3,0), dp(4,0), dp(5,0), dp(5,1), dp(5,2))
				.forEach(function(d) {
					d.push({ x: i, y: 0, label: i });
				})
			}

			$.each(response, function(i, f) {
				//Iterate Each Finance Data As 'f'
				if (f.date.year == year
					&& f.date.month == month
					&& f.date.day <= day) {
					//Summarize Monthly Report Data
					dp(3, 0)[f.date.day - 1].y += f.income;
					dp(4, 0)[f.date.day - 1].y += f.expenditure;
					dp(5, 0)[f.date.day - 1].y += f.income;
					dp(5, 1)[f.date.day - 1].y -= f.expenditure;
					dp(5, 2)[f.date.day - 1].y += (f.income - f.expenditure);

					if (f.date.day == day) {
						//Add Income And Expenditure Data Of Current Date
						f.income != 0 ?
						dp(0, 0).push({ y: f.income, indexLabel: f.name }) : '';

						f.expenditure != 0 ?
						dp(1, 0).push({ y: f.expenditure, indexLabel: f.name }) : '';						
					
						dp(2, 0).push({ y: f.income, label: f.name });
						dp(2, 1).push({ y: - f.expenditure, label: f.name });
						dp(2, 2).push({ y: f.income - f.expenditure, label: f.name });
					}
				}
			});

			if (window.screen.width <= 992 || day >= 17) {
				chart[3].options.data[0].indexLabel = '';
				chart[4].options.data[0].indexLabel = '';
				chart[5].options.data[2].indexLabel = '';
			}

			for (var i = 0; i < 3; i++)
				if (dp(i, 0).length)
					chart[i].options.subtitles[0].text = '';

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
	)
	
	.fail(function() {
		Materialize.toast('获取数据出错', 3000);
	});
});
