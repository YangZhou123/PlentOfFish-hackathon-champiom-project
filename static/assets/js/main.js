(function($) {

	skel.breakpoints({
		xxlarge: '(max-width: 1920px)',
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 1000px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)',
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$all = $body.add($header);

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 0);
			});

		// Touch mode.
			skel.on('change', function() {

				if (skel.vars.mobile || skel.breakpoint('small').active)
					$body.addClass('is-touch');
				else
					$body.removeClass('is-touch');

			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Fix: IE flexbox fix.
			if (skel.vars.IEVersion <= 11
			&&	skel.vars.IEVersion >= 10) {

				var $main = $('.main.fullscreen'),
					IEResizeTimeout;

				$window
					.on('resize.ie-flexbox-fix', function() {

						clearTimeout(IEResizeTimeout);

						IEResizeTimeout = setTimeout(function() {

							var wh = $window.height();

							$main.each(function() {

								var $this = $(this);

								$this.css('height', '');

								if ($this.height() <= wh)
									$this.css('height', (wh - 50) + 'px');

							});

						});

					})
					.triggerHandler('resize.ie-flexbox-fix');

			}

		// Prioritize "important" elements on small.
			skel.on('+small -small', function() {
				$.prioritize(
					'.important\\28 small\\29',
					skel.breakpoint('small').active
				);
			});

		// Gallery.
			$window.on('load', function() {

				var text = document.getElementById("message").value;
				if (text!="")
					activeKey()

				var $gallery = $('.gallery');

				$gallery.poptrox({
					baseZIndex: 10001,
					useBodyOverflow: false,
					usePopupEasyClose: false,
					overlayColor: '#1f2328',
					overlayOpacity: 0.65,
					usePopupDefaultStyling: false,
					usePopupCaption: true,
					popupLoaderText: '',
					windowMargin: 50,
					usePopupNav: true
				});

				// Hack: Adjust margins when 'small' activates.
					skel
						.on('-small', function() {
							$gallery.each(function() {
								$(this)[0]._poptrox.windowMargin = 50;
							});
						})
						.on('+small', function() {
							$gallery.each(function() {
								$(this)[0]._poptrox.windowMargin = 5;
							});
						});

			});

		// Section transitions.
			if (skel.canUse('transition')) {

				var on = function() {

					// Galleries.
						$('.gallery')
							.scrollex({
								top:		'30vh',
								bottom:		'30vh',
								delay:		50,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

					// Generic sections.
						$('.main.style1')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

						$('.main.style2')
							.scrollex({
								mode:		'middle',
								delay:		100,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

					// Contact.
						$('#contact')
							.scrollex({
								top:		'50%',
								delay:		50,
								initialize:	function() { $(this).addClass('inactive'); },
								terminate:	function() { $(this).removeClass('inactive'); },
								enter:		function() { $(this).removeClass('inactive'); },
								leave:		function() { $(this).addClass('inactive'); }
							});

				};

				var off = function() {

					// Galleries.
						$('.gallery')
							.unscrollex();

					// Generic sections.
						$('.main.style1')
							.unscrollex();

						$('.main.style2')
							.unscrollex();

					// Contact.
						$('#contact')
							.unscrollex();

				};

				skel.on('change', function() {

					if (skel.breakpoint('small').active)
						(off)();
					else
						(on)();

				});

			}

		// Events.
			var resizeTimeout, resizeScrollTimeout;

			$window
				.resize(function() {

					// Disable animations/transitions.
						$body.addClass('is-resizing');

					window.clearTimeout(resizeTimeout);

					resizeTimeout = window.setTimeout(function() {

						// Update scrolly links.
							$('a[href^="#"]').scrolly({
								speed: 1500,
								offset: $header.outerHeight() - 1
							});

						// Re-enable animations/transitions.
							window.setTimeout(function() {
								$body.removeClass('is-resizing');
								$window.trigger('scroll');
							}, 0);

					}, 100);

				})
				.load(function() {
					$window.trigger('resize');
				});

	});

	$("#analyze").on('click', function() {
		console.log("in")
		var text = document.getElementById("message").value;
		callApi(text);
	});

	function callApi(txt) {
		data = {"text": txt}
		$.post('/api', data, function(response) {
	    // Do something with the request
			console.log(response)
			//showChart(response)
			showChart2(response)
	    	// $()
		}, 'json');
	}

	var timeourId = 0;
	$('#message').keypress(function(e) {
		// KeyCode for 0-9
		if (Array.from(new Array(9), (x,i) => 48+i).includes(e.keyCode)) {
			clearTimeout(timeourId);
			timeourId = setTimeout(activeKey, 500);
		}
		// KeyCode for a-z
		else if (Array.from(new Array(24), (x,i) => 97+i).includes(e.keyCode)) {
			clearTimeout(timeourId);
			timeourId = setTimeout(activeKey, 500);
		}
		// KeyCode for Enter
		else if (e.keyCode == 13) {
			clearTimeout(timeourId);
			activeKey();
		}
	});

	function activeKey(){
		var text = document.getElementById("message").value;
		callApi(text);
	}

	function showChart2(data){
		data = data.document_tone.tone_categories[0].tones
		var myChart = echarts.init(document.getElementById('chart'));

		var alert_text = "Alert - ";
		for (var i in data){
			if (data[i]['score'] > 0.75){
				if (alert_text != "Alert - "){
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

		var option = {
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			title: [{
				text: 'Result: ' + (danger ? alert_text : 'Good') ,
				fontSzie: 10,
				x: '45%',
				textAlign: 'center'
			}],
			calculable : true,	
			series : [
				{
					name:'Tone Analyzer',
					type:'pie',
					radius : [30, 110],
					center: ['45%', '55%'],
					roseType : 'area',
					data:[
						// anger
						{value:data[0]['score'].toPrecision(5)*100, name:data[0]['tone_name']},
						// disgust
						{value:data[1]['score'].toPrecision(5)*100, name:data[1]['tone_name']},
						// fear
						{value:data[2]['score'].toPrecision(5)*100, name:data[2]['tone_name']},
						// joy
						{value:data[3]['score'].toPrecision(5)*100, name:data[3]['tone_name']},
						// sadness
						{value:data[4]['score'].toPrecision(5)*100, name:data[4]['tone_name']}
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



})(jQuery);