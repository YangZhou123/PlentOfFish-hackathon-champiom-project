(function() {
	// $("#textbox").on('click', function() {
	// 	// get element text box

	// 	// 
	// 	callApi(text);

	// });

	$("#button1").on('click', function() {
		var text = document.getElementById("textbox").value;
		callApi(text);
	});

	function callApi(txt) {
		data = {"text": txt}
		$.post('/api', data, function(response) {
	    // Do something with the request
			console.log(response)
			//showChart(response)
			showChart3(response)
	    	// $()
		}, 'json');
	}

	function showChart2(data){
		data = data.document_tone.tone_categories[0].tones
		var myChart = echarts.init(document.getElementById('chart'));
		var option = {
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			calculable : true,
			series : [
				{
					name:'Tone Analyzer',
					type:'pie',
					radius : [30, 110],
					center: ['75%', '50%'],
					roseType : 'area',
					data:[
						// anger
						{value:data[0]['score']*100, name:data[0]['tone_name']},
						// disgust
						{value:data[1]['score']*100, name:data[1]['tone_name']},
						// fear
						{value:data[2]['score']*100, name:data[2]['tone_name']},
						// joy
						{value:data[3]['score']*100, name:data[3]['tone_name']},
						// sadness
						{value:data[4]['score']*100, name:data[4]['tone_name']}
					]
				}
			],
			color: ['#CB4335', '#808B96', '#2C3E50', '#58D68D','#85C1E9'] //D2B4DE
		}
		myChart.setOption(option);
	}

	function showChart3(data){
		data = data.document_tone.tone_categories[0].tones
		var myChart = echarts.init(document.getElementById('chart'));
		var builderJson = {
			"all": 1,
			"charts": {
				"anger": data[0]['score'],
				"disgust": data[1]['score'],
				"fear": data[2]['score'],
				"joy": data[3]['score'],
				"sadness": data[4]['score']
			},
			"ie": 9743
		};
	
		var downloadJson = {
			"anger": data[0]['score'],
			"disgust": data[1]['score'],
			"fear": data[2]['score'],
			"joy": data[3]['score'],
			"sadness": data[4]['score']
		};

		var alert_text = "Alert! ";
		for (var i in data){
			if (data[i]['score'] > 0.75){
				if (alert_text != "Alert! "){
					alert_text += ","
				}
				alert_text += data[i]['tone_name']
			}
		}
		alert_text += " is too high!"

		var danger = 
			(data[0]['score'] > 0.75) ||
			(data[1]['score'] > 0.75) ||
			(data[2]['score'] > 0.75) || 
			(data[4]['score'] > 0.75) 
	
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = canvas.height = 100;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.globalAlpha = 0.08;
		ctx.font = '20px Microsoft Yahei';
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI / 4);
	
		var option = {
			backgroundColor: {
				type: 'pattern',
				image: canvas,
				repeat: 'repeat'
			},
			tooltip: {},
			title: [{
				text: 'Bar Chart',
				x: '25%',
				textAlign: 'center'
			}, {
				text: 'Pie Chart',
				subtext: danger ? alert_text : '' ,
				x: '75%',
				textAlign: 'center'
			}],
			grid: [{
				top: 50,
				width: '50%',
				bottom: '45%',
				left: 10,
				containLabel: true
			}, {
				top: '55%',
				width: '50%',
				bottom: 0,
				left: 10,
				containLabel: true
			}],
			xAxis: [{
				type: 'value',
				max: builderJson.all,
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				type: 'category',
				data: Object.keys(builderJson.charts),
				axisLabel: {
					interval: 0,
					rotate: 30
				},
				splitLine: {
					show: false
				}
			}],
			series: [{
				type: 'bar',
				stack: 'chart',
				z: 3,
				label: {
					normal: {
						position: 'right',
						show: true
					}
				},
				data: Object.keys(builderJson.charts).map(function (key) {
					return builderJson.charts[key];
				})
			}, {
				type: 'bar',
				stack: 'chart',
				silent: true,
				itemStyle: {
					normal: {
						color: '#eee'
					}
				},
				data: Object.keys(builderJson.charts).map(function (key) {
					return builderJson.all - builderJson.charts[key];
				})
			}, {
				name:'Tone Analyzer',
				type:'pie',
				radius : [30, 110],
				center: ['78%', '30%'],
				roseType : 'area',
				data:[
					// anger
					{value:data[0]['score']*100, name:data[0]['tone_name']},
					// disgust
					{value:data[1]['score']*100, name:data[1]['tone_name']},
					// fear
					{value:data[2]['score']*100, name:data[2]['tone_name']},
					// joy
					{value:data[3]['score']*100, name:data[3]['tone_name']},
					// sadness
					{value:data[4]['score']*100, name:data[4]['tone_name']}
				]
			}],
			color: ['#CB4335', '#808B96', '#2C3E50', '#58D68D','#85C1E9'] //D2B4DE
		};
		myChart.setOption(option);
	}

	function showPieBarChart(data){
		data = data.document_tone.tone_categories[0].tones
		var myChart = echarts.init(document.getElementById('chart'));
		var builderJson = {
		"all": 1,
		"charts": {
			"anger": data[0]['score'],
			"disgust": data[1]['score'],
			"fear": data[2]['score'],
			"joy": data[3]['score'],
			"sadness": data[4]['score']
		},
		"ie": 9743
		};
	
		var downloadJson = {
			"anger": data[0]['score'],
			"disgust": data[1]['score'],
			"fear": data[2]['score'],
			"joy": data[3]['score'],
			"sadness": data[4]['score']
		};
	
		var themeJson = {
			"dark.js": 1594,
			"infographic.js": 925,
			"shine.js": 1608,
			"roma.js": 721,
			"macarons.js": 2179,
			"vintage.js": 1982
		};
	
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = canvas.height = 100;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.globalAlpha = 0.08;
		ctx.font = '20px Microsoft Yahei';
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI / 4);
	
		// 指定图表的配置项和数据
		var option = {
			backgroundColor: {
				type: 'pattern',
				image: canvas,
				repeat: 'repeat'
			},
			tooltip: {},
			title: [{
				text: 'Tones',
				subtext: 'Total',
				x: '25%',
				textAlign: 'center'
			}, {
				text: 'Tones',
				subtext: 'Total ' + 100*Object.keys(downloadJson).reduce(function (all, key) {
					return all + downloadJson[key];
				}, 0)+ '%',
				x: '75%',
				textAlign: 'center'
			}],
			grid: [{
				top: 50,
				width: '50%',
				bottom: '45%',
				left: 10,
				containLabel: true
			}, {
				top: '55%',
				width: '50%',
				bottom: 0,
				left: 10,
				containLabel: true
			}],
			xAxis: [{
				type: 'value',
				max: builderJson.all,
				splitLine: {
					show: false
				}
			}],
			yAxis: [{
				type: 'category',
				data: Object.keys(builderJson.charts),
				axisLabel: {
					interval: 0,
					rotate: 30
				},
				splitLine: {
					show: false
				}
			}],
			series: [{
				type: 'bar',
				stack: 'chart',
				z: 3,
				label: {
					normal: {
						position: 'right',
						show: true
					}
				},
				data: Object.keys(builderJson.charts).map(function (key) {
					return builderJson.charts[key];
				})
			}, {
				type: 'bar',
				stack: 'chart',
				silent: true,
				itemStyle: {
					normal: {
						color: '#eee'
					}
				},
				data: Object.keys(builderJson.charts).map(function (key) {
					return builderJson.all - builderJson.charts[key];
				})
			}, {
				type: 'pie',
				radius: [0, '30%'],
				center: ['75%', '25%'],
				data: Object.keys(downloadJson).map(function (key) {
					return {
						name: key.replace('.js', ''),
						value: downloadJson[key]
					}
				})
			}]
		};
		myChart.setOption(option);
	}



}).call(this);


