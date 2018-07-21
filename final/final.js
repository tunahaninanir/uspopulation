
		

var width = 1060;
var height = 600;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    
				   .scale([1000]);         
        

var path = d3.geo.path()               
		  	 .projection(projection);  

		

var color = d3.scale.linear()
			  .range(["rgb(158, 93, 120)","rgb(224, 208, 215)","rgb(226,9,104)","rgb(38,2,18)"]);

var legendText = ["cities populated", "States popultaed", "States second grade", "not app"];


var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        

var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);


d3.csv("states.csv", function(data) {
color.domain([0,1,2,3]); 

d3.json("us-states.json", function(json) {


for (var i = 0; i < data.length; i++) {
	var dataState = data[i].state;
	var dataValue = data[i].visited;

	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {
		json.features[j].properties.visited = dataValue; 
		break;
		}
	}
}		
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {
	
	var value = d.properties.visited;

	if (value) {	
	return color(value);
	} else {	
	return "rgb(200,200,233)";
	}
});

		 
d3.csv("cities.csv", function(data) {

svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projection([d.lon, d.lat])[0];
	})
	.attr("cy", function(d) {
		return projection([d.lon, d.lat])[1];
	})
	.attr("r", function(d) {
		return Math.sqrt(d.years) * 4;
	})
		.style("fill", "rgb(21,22,22)")	
		.style("opacity", 0.85)	
	.on("mouseover", function(d) {      
    	div.transition()        
      	   .duration(200)      
           .style("opacity", .9);      
           div.text(d.place)
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");    
	})   

                
    .on("mouseout", function(d) {       
        div.transition()        
           .duration(500)      
           .style("opacity", 0);   
    });
});  
      var xScale = d3.scale.linear().domain([0,1500]).range([10,1000]);

var xAxis = d3.svg.axis().scale(xScale)
.ticks(5)
.orient("bottom");

var yAxis = d3.svg.axis().scale(xScale)	
.ticks(5)
.orient("left");

var x = svg.append("g")
.call(xAxis);  

var y = svg.append("g")
.call(yAxis); 

var legend = d3.select("body").append("svg")
      			.attr("class", "legend")
     			.attr("width", 140)
    			.attr("height", 200)
   				.selectAll("g")
   				.data(color.domain().slice().reverse())
   				.enter()
   				.append("g")
     			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	legend.append("rect")
   		  .attr("width", 18)
   		  .attr("height", 18)
   		  .style("fill", color);

  	legend.append("text")
  		  .data(legendText)
      	  .attr("x", 50)
      	  .attr("y", 9)
      	  .attr("dy", ".35em")
      	  .text(function(d) { return d; });
	});

});