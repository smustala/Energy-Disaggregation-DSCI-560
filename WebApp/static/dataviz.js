
function display_d3_dashboard(result_path_csv){

    d3.csv(result_path_csv).then(data=>{

    var mainsmax=d3.max(data, d=>+d.mains);
    var mainsavg=d3.mean(data, d=>+d.mains);

    var micmax=d3.max(data,d=>+d.microwave);
    var micavg=d3.mean(data,d=>+d.microwave);

    var dishmax=d3.max(data, d=>+d.dishwasher);
    var dishavg=d3.mean(data, d=>+d.dishwasher);
    console.log(dishmax);
    console.log(dishavg);

    var format=d3.format(",.2f");
    var peakformat=d3.format(",.0f");
    var intformat=d3.format(".0f");
    var pctformat=d3.format(".2%")

    d3.select("#dishavg")
        .text(format(dishavg));

    d3.select("#dishmax")
        .text(peakformat(dishmax));

    d3.select("#mainsavg")
        .text(format(mainsavg));

    d3.select("#mainsmax")
        .text(peakformat(mainsmax));

    d3.select("#micmax")
        .text(peakformat(micmax));

    d3.select("#micavg")
        .text(format(micavg));

    // line chart
    var margin ={ top: 10, left: 40, bottom: 20, right: 10};
    var width=parseInt(d3.select("#linechart").style("width"))-margin.left-margin.right;
    var height=parseInt(d3.select("#linechart").style("height"))-margin.top-margin.bottom;

    // set the color scale
    var color = d3.scaleOrdinal()
    .domain(['microwave','dishwasher','other','mains'])
    .range(["#CD5C5C", "#00BFFF", "dimgray",'dimgray']);

    var svg=d3.select("#linechart")
            .attr('width',width+margin.left+margin.right)
            .attr('height',height+margin.top+margin.bottom)
            .append('g')
            .attr('transform','translate('+margin.left+', '+margin.top+')');

    var xScale = d3.scaleLinear();
    var yScale = d3.scaleLinear();

    var xAxis=d3.axisBottom()
            .scale(xScale);

    var yAxis=d3.axisLeft()
            .scale(yScale);

    // axes range
    xScale.range([0,width]).nice();
    yScale.range([height,0]).nice();

    // domain
    xScale.domain(d3.extent(data, d=>+d.time));
    yScale.domain([0,d3.max(data, d=>+d.mains)]);

    // creating axes
    svg.append('g')
        .attr('class','xaxis')
        .attr('transform','translate(0,'+height+')')
        .style('color','gainsboro')
        .call(xAxis);

    svg.append('g')
        .attr('class','yaxis')
        .style('color','gainsboro')
        .call(yAxis);

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - ((margin.top-20) / 2))
        .attr('class','charttitle')
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style('font-family','Arial Narrow')
        .text("Mains Readings and Predicions for 4/18/2011-5/24/2011")
        .style('color','gainsboro');

    tipBox = svg.append('rect')
        .attr('width',width)
        .attr('height',height)
        .attr('opacity',0)
        .on('mousemove',drawTooltip);

    var tooltip=d3.select('#tooltip');
    var tooltipLine=svg.append('line')

    // Handmade legend
    svg.append("circle").attr("cx",width-70).attr("cy",30).attr("r", 6).style("fill", "dimgrey")
    svg.append("circle").attr("cx",width-70).attr("cy",60).attr("r", 6).style("fill", "#CD5C5C")
    svg.append("circle").attr("cx",width-70).attr("cy",90).attr("r", 6).style("fill", "#00BFFF")
    svg.append("text").attr("x", width-60).attr('class','legend').attr("y", 30).text("Mains").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-60).attr('class','legend').attr("y", 60).text("Microwave").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", width-60).attr('class','legend').attr("y", 90).text("Dishwasher").style("font-size", "15px").attr("alignment-baseline","middle")

    // Map columns
    var slices = data.columns.slice(1).map(function(id){
        return {
            id:id,
            values: data.map(function(d){
                return {
                    time: +d.time,
                    hz: +d[id]
                }
            })
        }
    })

    console.log(slices)

    var line=d3.line()
        .x(d=>xScale(d.time))
        .y(d=>yScale(+d.hz));

    var lines=svg.selectAll("lines")
        .data(slices)
        .enter()
        .append("g");

    lines
        .append('path')
        .attr('class',function(d){return('line ' + d.id)})
        .attr('d',d=>line(d.values));

    // Mouseover
    function removeTooltip() {
        if (tooltip) tooltip.style('display','none');
        if (tooltipLine) tooltipLine.attr('stroke','none');
    }

    function drawTooltip() {
        var x=xScale.invert(d3.pointer(event)[0]);
        var y=yScale.invert(d3.pointer(event)[1]);

        tooltipLine.attr('stroke','gainsboro')
            .attr('x1',xScale(x))
            .attr('x2',xScale(x))
            .attr('y1',0)
            .attr('y2',height);

        tooltip.html('Readings')
            .style('display', 'block')
            .attr('transform','translate(0,0')
            .selectAll()
            .data(slices).enter()
            .append('div')
            .style('color', function(d){return color(d.id)})
            .html(d => d.id + ': ' + format(d.values.find(d=>d.time==intformat(x)).hz))

    }

    /*************** PIE CHART ***************/
    //Create the values for the pie chart
    var micpie=d3.sum(data,d=>d.microwave);
    var dishpie=d3.sum(data,d=>d.dishwasher);
    var mainspie=d3.sum(data,d=>d.mains);
    var restpie=mainspie-(micpie+dishpie);
    var ck=micpie+dishpie+restpie;
    console.log(micpie, dishpie, restpie, mainspie,ck);

    var piedata=[
        {"label":"microwave","value":micpie},
        {"label":"dishwasher","value":dishpie},
        {"label":"other","value":restpie}
    ];

    console.log(piedata);

    var radius=d3.min([height,width])/2.5;

    var svgpie=d3.select("#piechart")
    .attr('width',width)
    .attr('height',height)
    .append('g')
    .attr('transform','translate('+width/2+","+height/2+")");

    var pie=d3.pie()
        .value(function(d){return d.value;})

    var arc=d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var outerarc=d3.arc()
        .innerRadius(0)
        .outerRadius(radius*2.25);

    var pietextarc=d3.arc()
        .innerRadius(0)
        .outerRadius(radius*1.75)

    console.log(pie(piedata));

    var arcs=svgpie.selectAll('pie')
        .data(pie(piedata))
        .enter()
        .append('g')
        .attr('class','slice')

    arcs.append('path')
        .attr('d',arc)
        .attr('fill',function(d){return color(d.data.label)})
        .attr('stroke','white')
        .style('stroke-width','2px')
        .style('opacity',1)

    arcs.append('text')
        .attr('transform',function(d){
            d.innerRadius=0;
            d.outerRadius=radius;
            return "translate("+outerarc.centroid(d)+")";
        })
        .attr('text-anchor','middle')
        .text(function(d,i) {return piedata[i].label})
        .attr('stroke-width','0px')
        .attr('fill','gainsboro')
        .attr('font-size','15px')

    var pietext=arcs.append('text')
        .attr('transform',function(d){
            d.innerRadius=1.5;
            d.outerRadius=radius*1.5;
            return "translate("+pietextarc.centroid(d)+")";
        })
        .attr('text-anchor','middle')
        .text(function(d,i) {return pctformat(piedata[i].value/ck)})
        .attr('fill','black')
        .attr('font-size','13px')
        .attr('stroke','black')
        .attr('stroke-width','0.5px')

})


}


//Using formData to upload the file

var form = document.forms.namedItem("form");

var theFile = document.getElementById('file');


const spinner = document.getElementById("loader");

//On clicking disaggregate button
document.getElementById("submitbtn").onclick = (ev) =>{

    alert(theFile.value.substring(12)+' uploaded successfully!');

    document.getElementById('formDiv').style.display = "none";

    spinner.style.display = "block";

    oData = new FormData(form);

      var oReq = new XMLHttpRequest();
      oReq.open("POST", "/server", true);
      oReq.onload = function(oEvent) {

        if (oReq.readyState == 4 && oReq.status == 200) {

            spinner.style.display = "none";

            document.getElementById('main').style.display = "block";

            // Calling data visualization function

            display_d3_dashboard("static/dashboard_data/results.csv")

        }

    else {
      oOutput.innerHTML = "Error " + oReq.status + " occurred when trying to upload your file.";
    }
  };

  oReq.send(oData);
  ev.preventDefault();
};






