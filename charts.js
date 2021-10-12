function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// B1. Create the buildCharts function.
function buildCharts(sample) {
  // B2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // B3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    var metaData = data.metadata

    // B4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample);

    // G1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = metaData.filter(metaObj => metaObj.id == sample);
    console.log(metaArray)

    //  B5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result)
    // G2. Create a variable that holds the first sample in the metadata array.
    var resultMeta = metaArray[0];
    console.log(resultMeta)

    // B6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds =result.otu_ids
    var otulabels = result.otu_labels;
    var sampleValues = result.sample_values;

    // G3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(resultMeta.wfreq)
    console.log(wfreq)

    // B7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).reverse().map(d=> "OTU" +d)
    console.log (yticks)

    // B8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otulabels.slice(0,10).reverse(),
      type: "bar",
      orientation:"h",
    }];
    // B9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 OTU",
      width: 450,
      height: 350
    };
    // B10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

     // L1. Create the trace for the bubble chart.
     var bubbleData = [{
       x: otuIds,
       y: sampleValues,
       text:otulabels,
       mode: "markers",
       marker: {
         size: sampleValues,
         color: otuIds
       }
     }
    ];

    // L2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title:"OTU ID"},
      margin: {
        l: 50,
        r: 50,
        t: 50,
        b: 50
      },
      width: 1120,
      hoverlabel: otuIds,
      hovermode: "closest" 
    };

    // L3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 

    // G4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x:[0,1], y:[0,1]},
      value: wfreq,
      title: "Scrubs per Week",
      type: "indicator",
      mode: "gauge+number",
      gauge: { axis:{range: [null, 10]},
              bar: { color: "black"},
              steps: [
                {range:[0,2], color: "red"},
                {range:[2,4], color: "orange"},
                {range:[4,6], color: "yellow"},
                {range:[6,8], color: "lime"},
                {range:[8,10], color: "green"}
              ]
            }
    }
    ];
    
    // G5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 450,
      height: 350,
      title: "Belly Button Washing Frequency",
      margin:{
        l: 20,
        r: 20,
        t: 100,
        b: 100
      }
    };

    // G6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);

  });
}
