//  d3.json("path/to/file.json", function(error, json) {
//    if (error) return console.warn(error);
//    data = json;
//    showPoll();
//  });

// Example JSON
var jsonArray = [
  { "poll_option" : "A", "vote_count" : 9, "color" : "rgb(83,158,44)" },
  { "poll_option" : "B", "vote_count" : 21, "color" : "rgb(44,83,158)" },
  { "poll_option" : "C", "vote_count" : 16, "color" : "rgb(158,44,83)" }];

var temp;
function showPoll() {

  $('#innerPoll').hide();
  window.temp = $('#bottom').html();
  $('#bottom').html("<button class='poll' onclick='reset()'>Go Back</button>");
  $('#top').html("<h3>Poll Results</h3>");

  // var before = jsonArray[0].vote_count;
  // jsonArray[0].vote_count = before++;

  //Set Container Height and Width
  var w = 200;
  var h = 215;
  var sum = d3.sum(jsonArray, function(d) {
              return d3.sum(d3.values(d,'vote_count'));
            });
  var barPadding = 2;

  //Creates Poll Container SVG
  var svg = d3.select('#idea_id_poll_result')
  	.append("svg")
  	.attr("width", w)
  	.attr("height", h);

  var rectangles = svg.selectAll("rect")
                	.data(jsonArray)
                	.enter()
                	.append("rect");

  var rectangleAttributes = rectangles
  	.attr("x", function(d, i) {
      	return i * (w / jsonArray.length);
  	})
  	.attr("y", function(d) {
      	return h;  //Returns height so animation will begin from bottom
  	})
  	.attr("width", w / jsonArray.length - barPadding)
    .transition().delay(function (d, i) { return i * 200;})
    .duration(200)
  	.attr("height", function(d) {
      	return Math.round(h*(d.vote_count / sum));  //Returns Height * (vote count divided by total vote_count) [ ex: 200 x 0.66 ]
  	})
    .attr("y", function(d) {
        return h - Math.round(h*(d.vote_count / sum));  //Returns Height minus the Height * (vote count divided by total vote_count) [ ex: 200 - (200 x 0.66) ]
    })
  	.attr("fill", function(d) {
      	return d.color;
  	})
    .attr("fill-opacity", function(d) {
        return (d.vote_count / sum); //Bar opacity is related to vote count divided by total vote_count [ ex: 0.66 ]
    });

    svg.selectAll("text.values")
       .data(jsonArray)
       .enter()
       .append("text")
       .text(function(d) {
            return d.vote_count;
       })
       .attr("x", function(d, i) {
            return i * (w / jsonArray.length) + (w / jsonArray.length - barPadding) / 2;
       })
       .attr("y", function(d) {
            return h - (Math.round(h*(d.vote_count / sum))) - 2 ;  //Vote count value label relative to top of each Bar
       })
       .attr("font-family", "sans-serif")
       .attr("text-anchor", "middle")
       .attr("font-size", "12px")
       .attr("font-weight", "bold")
       .attr("fill", function(d) {
            return d.color;
       });

    svg.selectAll("text.labels")
       .data(jsonArray)
       .enter()
       .append("text")
       .text(function(d) {
            return d.poll_option;
       })
       .attr("x", function(d, i) {
            return i * (w / jsonArray.length) + (w / jsonArray.length - barPadding) / 2;
       })
       .attr("y", function(d) {
            return h - (Math.round(h*(d.vote_count / sum))) + 20 ;  //Option option label position relative to top of each Bar
       })
       .attr("font-family", "sans-serif")
       .attr("text-anchor", "middle")
       .attr("font-size", "18px")
       .attr("font-weight", "bold")
       .attr("fill", "#ecf2f8");
}

function reset() {
  $('svg').remove();
  $('#bottom').html(window.temp);
  $('#top').html("<h3>Your Poll Question</h3>");
  $('#innerPoll').show();
}
