//FIRST: Use D3 to read our JSON, and add a failsafe if our data is undefined.

d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
    if (!data) {
        console.error("Error loading data");
        return;}

// Add the JSON data to our dropdown menu.
var menu = d3.select("#selDataset");
data.names.forEach(sample => {
    menu.append("option").text(sample).property("value", sample);});

// Initial update for all plots and metadata
updatePlotsAndMetadata(data.names[0]);

// Update all plots and metadata when you change the dropdown selection.
menu.on("change", function () {
    var thisSample = this.value;
    updatePlotsAndMetadata(thisSample);
});

// Have the app update all plots and metadata based on the sample you choose.
function updatePlotsAndMetadata(sample) {
    updateChart(sample);
    drawBubbleChart(sample);
    displayMetadata(sample);
}

//SECOND: set the app up to display horizontal bar charts for your selected samples

function updateChart(sample) {
    var selection = data.samples.find(d => d.id === sample);
    // Extract necessary data for the chart
    var trace = {
        type: 'bar',
        orientation: 'h',
        x: selection.sample_values.slice(0, 10).reverse(),
        y: selection.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: selection.otu_labels.slice(0, 10).reverse(),
        marker: {
            color: 'rgba(30,191,86,0.6)', // Set a custom color for the bars.
        }
    };

    var design = {
        title: `Top 10 Operational Taxonomic Units (OTUs) for Sample ${sample}`,
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' },
        margin: { t: 50, l: 150 }
    };

    // Plot the bar chart in the 'bar' div.
    Plotly.newPlot('bar', [trace], design);}

    //THIRD: enable bubble chart displays on the app for desired samples.

    function drawBubbleChart(sample) {
        var selection = data.samples.find(d => d.id === sample);
        // Extract necessary data for the bubble chart
        var bubtrace = {
            type: 'bubble',
            mode: 'markers',
            x: selection.otu_ids,
            y: selection.sample_values,
            marker: {
                size: selection.sample_values,
                color: selection.otu_ids,
                colorscale: 'Plasma' // Custom colorscale for a visually appealing yet well-segregated gradient.
            },
            text: selection.otu_labels,
        };

        var bubdesign = {
            title: `Bacterial Cultures for Sample ${sample}`,
            xaxis: {
                title: 'OTU IDs',
                tickvals: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500], // Set custom tick values
                ticktext: [0, 500, 1000, 1500, 2000, 2500, 3000, 3500]  // Set tick labels accordingly
            },
            yaxis: { title: 'Sample Values', 
            range: [0,250], 
            tickvals: [0, 25, 50, 75, 100, 125, 150, 175, 200, 225] },
            margin: { t: 50 }
        };

        // Plot the bubble chart in the 'bubble' div.
        Plotly.newPlot('bubble', [bubtrace], bubdesign)}

        //FOURTH: enable displays of any selected sample metadata.
        // Make a function to display sample metadata based on your choice of sample.
    function displayMetadata(sample) {
        var metadata = data.metadata.find(d => d.id == sample);

        // Select the metadata div and clear any existing content.
        var metadataDiv = d3.select("#sample-metadata");
        metadataDiv.html("");

        //FIFTH: Loop through the metadata's key-value pairs and append all of them to the div.
        // Loop through the key-value pairs in the metadata and append them to the div
        Object.entries(metadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    }
});
//SIXTH: Deploy the index.html to ensure everything updates when you select a new subject.