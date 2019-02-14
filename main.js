
function drawPlot(dataset){

    var timeParse = d3.timeParse("%M:%S");
    var timeFormat = d3.timeFormat("%M:%S");
    // var rainbow2 = d3.scaleSequential(d3.interpolateRainbow).domain([0,3]);


    var timeArray = [];
    const w = 900;
    const h = 750;
    const padding = 70;

    dataset.forEach(function (value) {
        timeArray.push(timeParse(value.Time))
    });

    var tooltip = d3.select("body").append("div").attr("class","tooltip").attr("id","tooltip");

    const minTime = d3.min(timeArray,(d)=>d);
    const maxTime = d3.max(timeArray,(d)=>d);

    const minYear = d3.min(dataset, d=>d.Year)-1;
    const maxYear = d3.max(dataset, d=>d.Year)+1;

    //defining scale
    const yScale = d3.scaleTime()
        .domain([minTime,maxTime])
        .range([padding, h-padding]);

    const xScale = d3.scaleLinear()
        .domain([minYear,maxYear])
        .range([padding, w-padding]);

    //create axis
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));



    //creating main canvas
    const svg = d3.select("#main").append("svg").attr("width",w).attr("height",h);




    //adding main title
    // svg.append("text")
    //     .attr("id","title")
    //     .attr("class","chart-title")
    //     .attr("x",w/2-150)
    //     .attr("y",50)
    //     .text("Cyclist Doping Test Data");

    //appending circles
    svg.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("cx",d=>xScale(d.Year))
        .attr("cy",function (d) {
            return yScale(timeParse(d.Time))
        })
        .attr("r",d => 8)
        .attr("data-xvalue", d=>d.Year)
        .attr("data-yvalue", d=>timeParse(d.Time))
        .style("fill",function (d) {
            return d.Doping == "" ? "navy" : "red";
        })
        // .attr("fill",(d,i)=>{
        //     return d.Doping ==""? "red" : rainbow2(i);
        // })
        .on("mouseover",function (d,i) {
            if(d.Doping == ""){
                tooltip
                    .style("left",d3.event.pageX + 20 + "px")
                    .style("top",d3.event.pageY + "px")
                    .style("display","inline-block")
                    .style("opacity",.8)
                    .attr("data-year",d.Year)
                    .html("Name: " + d.Name + "<br>" + "Year: " + d.Year);
            }else{
                tooltip
                    .style("left",d3.event.pageX - 80 + "px")
                    .style("top",d3.event.pageY + 20 + "px")
                    .style("display","inline-block")
                    .style("opacity",.8)
                    .attr("data-year",d.Year)
                    .html("Name: " + d.Name + "<br>" + "Year: " + d.Year + "<br>" + "Doping: " + d.Doping);
            }
        })
        .on("mouseout",function (d) {
            tooltip.style("opacity",0)
        })

    // Adding axis on svg
    svg.append("g")
        .attr("transform", "translate(" + padding + "," + 0 + ")")
        .attr("id", "y-axis")
        .call(yAxis);

    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

    // console.log("min: " + minTime + " max: " + maxTime);

    // Adding Legend to the chart
    const colors = ["red","navy"];
    svg.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("class","legend")
        .attr("x", w-100)
        .attr("y",(d,i)=>{
            return i* 21 + padding * 2;
        })
        .attr("width",20)
        .attr("height",20)
        .style("fill", d=>d)
        .attr("id","legend");

    svg.append("text")
        .attr("transform","translate("+(w-130)+","+(padding*2 + 16)+")")
        .style("text-anchor","end")
        .text("Riders with doping allegations");

    svg.append("text")
        .attr("transform","translate("+(w-130)+","+(padding*2 + 36)+")")
        .style("text-anchor","end")
        .text("No doping allegations");
}

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",function (data) {
    var dataset = data;
    // console.log(dataset)
    drawPlot(dataset);
})