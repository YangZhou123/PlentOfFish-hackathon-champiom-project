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
	    	// $()
		}, 'json');
	}



}).call(this);


