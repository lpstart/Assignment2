﻿	var w = 950,h=500;
	var sex_select;
					
	var	force = d3.layout.force()
	             .size([w, h]) 
	             .linkDistance([50])        // <-- New!
	             .charge([-100]);
	var dataset = null;	
	var svg = d3.select(".c_right").append("svg")
															.attr("width",w)
															.attr("height",h)
															.attr("id","svg");
	
	var nodes = svg.selectAll("circle");
	var edges = svg.selectAll("line");
	var edges_text = svg.selectAll(".linetext");														
	
	
  var colors = d3.scale.category20();
	
	
	function fill_opacity(d,i,sex_select){
			if(sex_select == "全部"){
					return 1.0;
				}else if(sex_select == "男"){
						if(d.sex == "男"){
							return 1.0;
						}else {
							return 0.0;
							}				
				}else if(sex_select == "女"){
						if(d.sex == "女"){
								return 1.0;
							}else {
								return 0.0;
								}	
					}		
		}
		
			
		
function reloadNetwork(){		             
			edges.style("stroke", "#ccc")
					 .style("stroke-width", 1);
			edges_text.style("fill","black")
        				.text(function(d){
        						return d.relation;
        					});			
			nodes.attr("r", 10)
				  .style("fill", function(d, i) {
				         
				          return "#191";
				  })
				  .style("fill-opacity",function(d,i){
				  		 
				  		var sex_select=$("#sex option:selected").text();
				  		return fill_opacity(d,i,sex_select);
				  	})
				  .on("mouseover",function(d,i){
				  		$("#person_inforation").html("姓名："+d.name+"<br/>性别："+
				  										d.sex+"<br/>职位："+d.position+"<br/>智力："+
				  										d.intellegence+"<br/>武力："+d.force);
				  		
				  		edges_text.style("fill-opacity",function(edge){
				  				if(edge.source ===d || edge.target ===d)
				  					return 1.0;
				  			});
				  	})
				  .on("mouseout",function(d,i){
				  	$("#person_inforation").html("");
				  		edges_text.style("fill-opacity",function(edge){
				  				if(edge.source === d || edge.target ===d)
				  				return 0.0;
				  			});
				  	})
				  .call(force.drag);
						  
						  
			force.on("tick",tick);
     
	}	
		
	function refreshNetwork(){
		sex_select=$("#sex option:selected").text();	
		
		reloadNetwork();
	}

												
		
	d3.text("data/relation.json","application/json,charset=utf-8",function(text){
	
			var json = text?JSON.parse(text):null;
			dataset = json;														
	     force.nodes(dataset.nodes)
	         .links(dataset.edges)
	         .start();			             			            
			edges.data(dataset.edges)
	        .enter()
	        .append("line");
		  nodes.data(dataset.nodes)
				  .enter()
				  .append("circle");
			edges_text.data(dataset.edges)
					.enter()
					.append("text")
					.attr("class","linetext");				        					
				refreshNetwork();
				reloadNetwork();
			});
			
	function tick(){
			edges.attr("x1", function(d) { return d.source.x; })
								     .attr("y1", function(d) { return d.source.y; })
								     .attr("x2", function(d) { return d.target.x; })
								     .attr("y2", function(d) { return d.target.y; });		
			 nodes.attr("cx", function(d) { return d.x; })
			     .attr("cy", function(d) { return d.y; });
			 edges_text.attr("x",function(d){return (d.source.x + d.target.x)/2;})
						.attr("y",function(d){return (d.source.y+d.target.y)/2;});		
			}	