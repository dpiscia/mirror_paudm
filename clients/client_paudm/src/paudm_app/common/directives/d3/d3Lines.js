'use strict';

/* Directives */


angular.module('d3Lines', ['d3', 'plot_data_prepation'])
.directive('d3Lines', ['d3',  'mod_plot_status' ,'mod_plot_task',function(d3,mod_plot_status,mod_plot_task) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {data: '=data',
				type : '=',},
		link: function(scope, element, attrs){
			var margin = {top: 20, right: 80, bottom: 30, left: 50};
    		scope.w = 960 - margin.left - margin.right ,
    		scope.h = 400 - margin.top - margin.bottom;
			var svg = d3.select(element[0]).append("svg")
				.attr("width", scope.w + margin.left + margin.right + 200)
				.attr("height", scope.h + margin.top + margin.bottom).append("g")
    			.attr("transform", "translate(50 ,20 )");

			scope.$watch(
				'data+type', 
				function(){
					return scope.render();
				}, true);
// define render function
			
			scope.render = function(){
	svg.selectAll("path").remove();
	svg.selectAll('g.legend').remove();
	svg.selectAll('g.state').remove();
	
	svg.selectAll(".y.axis").remove();
    svg.selectAll(".x.axis").remove();
	//svg.selectAll(".legend").remove();
	var data;
	console.log("change graph",scope.data.length);
	if (scope.type === "task") {data = mod_plot_task(scope.data);}
	else {data = mod_plot_status(scope.data);} 
	//var data = mod_plot(scope.data);
	
	//var data = mod_plot_task(scope.data);
var x = d3.time.scale()
    .range([0, scope.w]);

var y = d3.scale.linear()
    .range([scope.h, 0]);

var color = d3.scale.category10();






var line = d3.svg.line()
    .interpolate("step-after")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.counts); });

//color.domain(["CREATED","QUEUED", "STARTED", "FAILED", "DONE"]);
 color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));


data.forEach(function(d) {
    d.date = d.date;
    
  });
var status = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, counts: +d[name]};
      })
    };
  });
    x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(status, function(c) { return d3.min(c.values, function(v) { return v.counts; }); }),
    d3.max(status, function(c) { return d3.max(c.values, function(v) { return v.counts; }); })
  ]);

 var legend = svg.selectAll('g')
        .data(status)
        .enter()
        .append('g')
        .attr('class', 'legend');

    legend.append('rect')
        .attr('x', scope.w + 70)
        .attr('y', function(d, i){ return i *  20;})
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function(d) { 
          return color(d.name);
        });

    legend.append('text')
        .attr('x', scope.w  + 82)
        .attr('y', function(d, i){ return (i *  20) + 9;})
        .text(function(d){ return d.name; });
     

     
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format("%X"))
    .orient("bottom"); 
    
       
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + scope.h + ")")
      .call(xAxis);
       
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");
      
      
      var state = svg.selectAll(".state")
      .data(status);
      
      
      
      
      state.enter().append("g")
      .attr("class", "state");

		
		
  state.append("path")
		.attr("class", "line")
		.attr("d", function(d) { 
			return line(d.values); })
		.style("stroke", function(d) { return color(d.name); })
		.style("stroke-width", 2);


     
      

				};

		}
	};     
}]);