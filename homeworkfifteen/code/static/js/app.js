function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

    
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(`/metadata/${sample}`).then(function(result){
      console.log(result)
      var sample_metadata = d3.select("#sample-metadata")
      console.log(sample_metadata)
    
    
    // Use `.html("") to clear any existing metadata
      sample_metadata.html("");
 

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    
      sample_metadata.append("h6").text(`AGE: ${result.AGE}`);
      sample_metadata.append("h6").text(`BBTYPE: ${result.BBTYPE}`);
      sample_metadata.append("h6").text(`ETHNICITY: ${result.ETHNICITY}`);
      sample_metadata.append("h6").text(`GENDER: ${result.GENDER}`);
      sample_metadata.append("h6").text(`LOCATION: ${result.LOCATION}`);
      sample_metadata.append("h6").text(`WFREQ: ${result.WFREQ}`);
      sample_metadata.append("h6").text(`SAMPLE: ${result.SAMPLE}`);
      
  })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(result){

  
    // @TODO: Build a Bubble Chart using the sample data
    var trace2 ={
      type: 'bubble',
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      backgroundcolor: result.otu_ids,
      mode: 'markers',
      marker: {
        color: result.otu_ids,
        size: result.sample_values,
      }
  };

  var graph = [trace2];
  var label = {
    xaxis: {title: "otu id"}
  }


  Plotly.newPlot("bubble", graph, label);       

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    console.log(result);
    var c = result.sample_values.map(function(e, i) {
      return [e, result.otu_ids[i]];
    });
    c.sort((a,b) => b[0] - a[0]);
    var top = c.slice(0,11);
    console.log(top);
    var top_otu_id = [];
    top.forEach(t => top_otu_id.push(t[1]));
    var top_sample_values = [];
    console.log(top_otu_id)
    console.log('tops')
    top.forEach(t => top_sample_values.push(t[0]));
    //map(top_sample_values => top[0])
    // otu_ids, and labels (10 each).
    var trace1 = {
      labels: top_otu_id,
      values: top_sample_values,
      type: 'pie'
    };
   
    var data = [trace1];
   
    var layout = {
      title: result.otu_labels,
    };
    console.log("Nolan");
   
    Plotly.newPlot("pie", data, layout);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {

  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
