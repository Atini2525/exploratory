// If you look closely, you can also see that the values associated with these properties are all strings. This is probably not what you want in the case of numbers. When loading CSVs and other flat files, you have to do the type conversion.

  // We will see more of this in other tasks, but a simple way to do this is to use the + operator (unary plus). forEach can be used to iterate over the data array.
   // with json no need to put + for numeric , no need conversion 
//   import d3 from 'd3';




  
   const width = window.innerWidth * 0.8,
   height = window.innerHeight * 0.8,
   margin = { top: 20, bottom: 50, left: 60, right: 40 };
var color = d3.scaleOrdinal(d3.schemeCategory10);
var colorScale = d3.scaleLinear()
//.domain([1, 10, 20])
//.range(['#d73027', '#fee08b', '#1a9850'])
.range(['#fee08b', '#1a9850', '#d73027'])

//.range(["yellow", "red"])
.interpolate(d3.interpolateHcl); 



       let svg;
       var name=[];
       var data2=[];
//     
var   Ladder_score=[];
var countryById = d3.map();
    // inisiate the object state 
           let state = {
               datageojson: null,
               datahappy: null,
               datageometrie: null,
               hover: { // hover is an object and it has two properties latitude and 
                 latitude1: null,
                 longitude1: null,
               },
             };   
             
          
           //read in topojson
           /*d3.queue()
           .defer(d3.json,"usState.json")
           .await(ready)*/
  Promise.all([
              d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),d3.csv("happinessbycountry.csv"), // pull a new file in promises 
          ]).then( ([datageojson,datahappy])=>{ // it returns an object 
          
            var countries = topojson.feature(datageojson,datageojson.objects.countries).features;
            //neighbors = topojson.neighbors(datageojson.objects.countries.geometries);
            state.datageojson = countries;
               state.datahappy= datahappy;

             //  colorScale.domain(d3.extent(state.datahappy.Ladder_score, function(d) {return d.state.datahappy.Ladder_score;}));
             data2 = state.datahappy.map(function (e) {
              return Ladder_score=+e.Ladder_score;
            });
           
               init();
           });
   
           function init() {
            
             console.log(data2);
            // colorScale.domain(d3.extent(data2, function(d) {return d.data2;}));
             colorScale.domain([d3.min(data2), d3.max(data2)]); // color scale since my data is an array and not an object, I used Min and max

            var zoom = d3.zoom(); // for the zoom 
            svg=d3.select("#map")
            .append("svg")
            .attr("height",height  )
            .attr("width",width)
            .call(d3.zoom().on('zoom',()=>{
             console.log('zoom');
             svg.attr("transform", d3.event.transform) // zoom transform 
            }))
             .append("g")
         
         
          ///      svg.call(tip);       
   const projection = d3.geoMercator();
   var path=d3.geoPath()
   .projection(projection)

   /*state.datageojson.foreach( d=>{
     Object.assign
   });
   */
          //create the element 
           svg.selectAll(".state")
              .data(state.datageojson)
              .enter().append("path")
              .attr("class","state")
             .attr("d",path)
             .attr("country", d=> d.properties.name)
           //  .attr("id", d=> d.id);
           svg.call(tip);
            svg.selectAll('path')
         // .on("mouseover", handleMouseover1) ;  
       //  svg.selectAll('path')
         .on("mouseover", tip.show) // for the tooltip
         .attr('fill', function(d,i) {  // color of the map depending of the size
          //console.log(d.Ladder_score);
          return getColor(d);
      })		
      .append("title");
         
             /*.on("mouseover", function(d, i) {
              tip.show(d);
              //reporter1(d) ;               
                              });*/
  
                function reporter1(x) { // my first try of tooltip 
                       console.log(x)
            state.datahappy.forEach(function(d, i) {
              state.datageojson.forEach(function(e, j) {

              d3.selectAll("#report1").text(function() {

             if (d.id === e.id) {
          console.log(d.id)
          console.log(e.id)
           e.name = d.name
           e.Ladder_score=d.Ladder_score
             }
             return [x.name,x.Ladder_score];

            })
            })
          })
        }
        function getColor(d) {
          
          state.datahappy.forEach(function(f, i) {
            state.datageojson.forEach(function(e, j) {

           if (f.id === e.id) {
       // console.log(f.id)
       // console.log(e.id)
         e.name = f.name
         e.Ladder_score=f.Ladder_score  
           } 
          })
        })
        return colorScale(d.Ladder_score);
      
      }

      var linear = colorScale;
      svg.append("g")
      .attr("class", "legendLinear")
     // .attr("transform","translate(-150,100)");
     .attr("transform","translate(1000,100)");
      var legendLinear = d3.legendColor()
      .shapeWidth(30)
      .orient('horizontal')
      .scale(linear);
    
    svg.select(".legendLinear")
      .call(legendLinear);
     
     
      }



             var tip = d3.tip()  // tooltip 
             .attr('class', 'd3-tip')
             .offset([-5, 0])
             .html(function(d) {
              state.datahappy.forEach(function(f, i) { // I found only this solution to match json and csv
                state.datageojson.forEach(function(e, j) { // it tooks me around 3 days to figure out it 
                                                          // but I am sure there is a better solution 
               if (f.id === e.id) {                      // I did not know how to declare this function and use it repeatdely
            console.log(f.id)
            console.log(e.id)
             e.name = f.name
             e.Ladder_score=f.Ladder_score  
               }
              })
            })
            return d.name + ": " + d.Ladder_score; // data return 
             });

             