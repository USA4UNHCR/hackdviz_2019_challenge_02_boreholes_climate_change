var data;
function siteReady() {
	d3.csv("Water_Usage_In_Camps_Most_Recent_Data.csv")
		.then( function (_data){
			data = _data;
			// console.log(data);
			loadCountries();
		})
		.catch( function(error) {
			console.log(error + " error!");
		});
}
var countryArray = [];
function loadCountries () {
	// console.log("loadCountries");
	// take the dataset
	// build array of country names
	for( var i = 0; i<data.length; i++){//data.length
		if (data[i]['COUNTRY NAME'] != "") {
			countryArray[data[i]['COUNTRY NAME']] = null;
		}
	}
	// populate country drop down
	countryArray = Object.keys(countryArray);
	var _html = "<option default value='nothing'>Please Choose a Country</option>";
	for(var i = 0; i < countryArray.length; i++) {
		_html += "<option value='";
		_html += countryArray[i];
		_html +="'>"+countryArray[i]+"</option>";
	}
	var countrySelectElement = document.getElementById("country");
	countrySelectElement.innerHTML = _html;
	// on select, call the loadSites function with the country
	countrySelectElement.addEventListener( "change", (event) => { 
		if (event.target.value != "nothing") {
			loadSites(event.target.value);
		}
		countrySelectElement.removeEventListener("change", ()=>{});
	});
}
function loadSites(countryName) {
	clearGraph();
	//
	var siteSelect = document.querySelector("#camp");
	// unhide the site selection
	siteSelect.disabled = false;
	console.log("loadSites => " + countryName);
	var siteArray = [];
	for (var i = 0; i<data.length; i++) {
		if ( data[i]['COUNTRY NAME'] == countryName ) {
			siteArray[data[i]['LOCATION NAME']] = null;
		}
	}
	siteArray = Object.keys(siteArray);
	console.log(siteArray);
	// populate all the sites from the specific country in the select
	var _html = "<option default value='nothing'>Please Choose a Site</option>";
	for(var i = 0; i < siteArray.length; i++) {
		_html += "<option value='";
		_html += siteArray[i];
		_html +="'>"+siteArray[i]+"</option>";
	}
	siteSelect.innerHTML = _html;
	// call a site's history bases on selection, and call drawGraph
	siteSelect.addEventListener("change", (event) => {
		if (event.target.value != "nothing") {
			drawGraph(event.target.value);
		}
		siteSelect.removeEventListener("change", ()=>{});
	});
}
function clearGraph () {
	// clear the last graph
	var g = document.querySelector("#graph");
	g.innerHTML = "";
	g.style.height = "1%";
}
function drawGraph(siteName) {
	console.log("draw graph => " + siteName);
	document.querySelector("#graph").style.height = "70%";
	// show all data from that particular site with each individual date
	var siteArray = [];
	for (var i = 0; i<data.length; i++){ //data.length
		// console.log(data[i]['LOCATION NAME'].indexOf(siteName) > -1);
		if ( data[i]['LOCATION NAME'].indexOf(siteName) > -1 ) {
			siteArray.push(data[i]);
		}
	}
	clearGraph();
	// console.log(siteArray);
	// add a new one (yes, there's faster ways of doing this, but it's easy)
	var canvas = d3.select("#graph").append("svg")
		.attr('width', "100%")
		.attr('height', "100%");
	var spacer = document.querySelector('#graph').offsetWidth/(siteArray.length+1);
	var circleY = 200;
	//console.log( document.querySelector('#graph').offsetWidth);
	
	canvas.selectAll('line').data(siteArray)
		.enter().append('line')
			.attr('x1', function (d, i) {
					return spacer*i + spacer;
				})
			.attr('y1', function (d, i) {
				return (i%2 == 0) ? 280 : 300;
			})
			.attr('x2', function (d, i) {
					return spacer*i + spacer;
				})
			.attr('y2', circleY + 20);
			// .attr('stroke', "gray")
			// .attr('stroke-width', "5");
		//    <text x="50" y="50" font-family="sans-serif" font-size="12px" fill="red">Circle<text>
	canvas.selectAll('circle').data(siteArray)
		// add a circle for each liter of water. 
			.enter().append('circle')
			.attr('cx', function (d, i) {
				return spacer*i + spacer;
			})
			.attr('cy', circleY)
			.attr('r', function (d) {
				return (d['AVERAGE # LITERS OF POTABLE WATER AVAILABLE PER PERSON PER DAY'] || 1);
			});
	canvas.selectAll('text').data(siteArray)
			.enter().append('text')
			.attr('text-anchor', 'middle')
			.attr('x', function (d, i) {
				return spacer*i + spacer;
			})
			.attr('y', function (d, i) {
				return (i%2 == 0) ? 300 : 320;
			})
			.text( function (d) {
				var millisDate = new Date( Date.parse(d['DATE END']) );
				var liters = (d['AVERAGE # LITERS OF POTABLE WATER AVAILABLE PER PERSON PER DAY'] || "1");
				return liters + "L " + millisDate.toDateString().substr(3);
			});
	// Add in the circle for reference 
	canvas.append('circle')
		.attr('id', 'requiredCircle')
		.attr('r', '20')
		.attr('cx', '50%')
		.attr('cy', '75%');
	canvas.append('text')
		.attr('id', 'requiredText')
		.attr('text-anchor', 'middle')
		.attr('x', '50%')
		.attr('y', '83%')
		.text("20L Required Amount of Water");
	// Add in title Cirlces!
	canvas.append('text')
		.attr('id', 'titleCountry')
		.attr('x', '5%')
		.attr('y', '64px')
		.text( document.getElementById("country").value );
	canvas.append('text')
		.attr('id', 'titleCampName')
		.attr('x', '5%')
		.attr('y', '90px')
		.text(document.getElementById("camp").value);

	document.querySelector("#graph").style.height = "70%";

}




