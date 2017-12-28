(function($) {
	$("#predict").on('click', function() {

		var user_id = document.getElementById("user_id").value;
		callPrediction(user_id);
	});

	function callPrediction(user_id) {
		data = {"user_id": user_id};
		console.log(data)

		$.post('/predict', data, function(response) {
			showPrediction(response);
		}, 'json');
	}


	function showPrediction(response) {
		var userTable = $("#userTable")

		// clean the table
		userTable.html("");

		for (var i=0; i<response.length; i++) {
			var userData = JSON.parse(response[i]);
			if (userData.length == 0) {
				continue;
			}
			var user = userData[0];

			// create a row
			var row = $("<tr></tr>");
			for (var key in user) {
				var col = $("<td></td>");
				col.html(user[key]);
				row.append(col);
			}
			
			userTable.append(row);
		}

	}

})(jQuery);