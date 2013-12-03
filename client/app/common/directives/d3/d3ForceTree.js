'use strict';

/* Directives */


angular.module('d3Forcetree', ['d3', 'plot_data_prepation'])
.directive('d3Forcetree', ['d3',  'tree_dict_from_flatten' ,'group_task','group_status','select_by_id' , function(d3,tree_dict_from_flatten,group_task, group_status, select_by_id) {
  // data should be provided as:
  // scope.data = {nodes : ['name' : name, group : group"], links : ["target" : id, "source " : id , "value" :  number] }
	return {
		restrict: 'EA',
		scope: {
				head: '=head',
				data: '=data',
				type : '=',},
		link: function(scope, element, attrs){
				scope.w = 800;
				scope.h = 500;
				scope.force = d3.layout.force()
					.charge(function(d) { return d._children ? -d.size / 100 : -30; })
					.linkDistance(80)
					.size([scope.w, scope.h - 160]);
				var svg = d3.select(element[0])
					.append("svg:svg")
					.attr("width", scope.w + 300)
					.attr("height", scope.h);
	
	
				scope.$watch(
					'data+type', 
					function(){
						return scope.render();
					}, true);
// define render function
			
				scope.render = function(){
					var mod_data = scope.head.concat(scope.data);
					svg.selectAll("legend").remove();
					svg.selectAll("rect").remove();
					svg.selectAll("circle").remove();
					svg.selectAll("text").remove();
					svg.selectAll("g").remove();      
					svg.selectAll("line.link").remove();
					svg.selectAll("line.link_2").remove();
					var node,
					    link,
					    root;
					var color = d3.scale.category20();    
					var links_dep = [];
					root = tree_dict_from_flatten(mod_data[0],[],mod_data)[0];
					root.fixed = true;
					root.x = scope.w / 2;
					root.y = scope.h / 2 ;  
					var nodes = flatten(root),
	  					links = d3.layout.tree().links(nodes);
	  					
	    			for (var i=0; i< scope.data.length; i++)
	    				{for (var j=0; j< scope.data[i].dep.length; j++)
	    					{links_dep.push( {source : select_by_id(nodes, nodes[i].id) , target : select_by_id(nodes, scope.data[i].dep[j] ) , type : "dep" }); }
	    				}
					var legend = svg.selectAll('g')
						.data(function() {if (scope.type === 'task' ) {return group_task(mod_data);}
											else {return group_status(mod_data);}})
						.enter().append('g').attr('class', 'legend').attr("transform", "translate(0 ,20 )");
	  				links = links.concat(links_dep);
					legend.append('rect')
						.attr('x', scope.w )
						.attr('y', function(d, i){ return i *  25;})
						.attr('width', 10)
						.attr('height', 10)
						.style('fill', function(d) { 
						  return color(d);
						});
	
					legend.append('text')
						    .attr('x', scope.w + 12)
						    .attr('y', function(d, i){ return (i *  25) + 9;})
						    .text(function(d){ return d; });
	  // Restart the force layout.
					scope.force
						.nodes(nodes)
						.links(links)
						.start();


			      	link = svg.selectAll('line.link')
			          .data(links)
			       	  .enter().append('svg:line')
			          .attr("class", function(d) { if (d.type === undefined) {return 'link';} else {return 'link_2'; } })      
			          .style('stroke-width', 3)
			          .attr("marker-end", "url(#end)")
			          .attr("x1", function(d) { return d.source.x; })
			          .attr("y1", function(d) { return d.source.y; })
			          .attr("x2", function(d) { return d.target.x; })
			          .attr("y2", function(d) { return d.target.y; })
					  .attr("marker-end", "url(#arrow)");;

			          
					node = svg.selectAll("circle.node")
					      .data(nodes)
					      .enter().append("svg:circle")
					      .attr("class", "node")
					      .attr("cx", function(d) { return d.x; })
					      .attr("cy", function(d) { return d.y; })
					      .attr("r",  5)
					      .style("fill", function(d) {if (scope.type === 'task' ) {return color(d.name);} else {return color(d.status);}})
										.on("click", function(d){
											if (d.children) {
												d._children = d.children;
												d.children = null;
											} else {
												d.children = d._children;
												d._children = null;
											}
											
										})
					      .on("mouseover", mouseover)
						  .on("mouseout", mouseout)
					      .call(scope.force.drag);

					node.append('svg:title')
						.text(function(d) { return d.name; });
					node.append("text")
						.text(function(d) { return d.name; })
						.style("fill", "#555").style("font-family", "Arial").style("font-size", 12);


  
					scope.force.on("tick", function() {
						link.attr("x1", function(d) { return d.source.x; })
						    .attr("y1", function(d) { return d.source.y; })
						    .attr("x2", function(d) { return d.target.x; })
						    .attr("y2", function(d) { return d.target.y; });
	
						node.attr("cx", function(d) { return d.x; })
						    .attr("cy", function(d) { return d.y; });
					});

					// Returns a list of all nodes under the root.
					function flatten(root) {
					  var nodes = [], i = 0;
					
					  function recurse(node) {
					    if (node.children) {node.children.forEach(recurse);}
					    if (!node.id) {node.id = ++i;}
					    nodes.push(node);
					  }
					
					  recurse(root);
					  return nodes;
					}



					function mouseover() {
					  d3.select(this).transition()
					      .duration(750)
					      .attr("r", 10);
					}
					
					function mouseout() {
					  d3.select(this).transition()
					      .duration(750)
					      .attr("r", 5);
					}
				};

		}
	};     
}]);