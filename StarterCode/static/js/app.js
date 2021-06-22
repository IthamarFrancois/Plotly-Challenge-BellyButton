///////// GLOBAL VARIABLES  /////////

// JSON Path
var JsonPathURL = 'samples.json'
var DrpDown = d3.select('#selDataset');
var DemographicBox = d3.select('#sample-metadata');



/////////  Access 'data' from JSON file  /////////
function init() 
{
    // Will link dropdown menu to the selections based on 'data.names'
    //let DrpDown = d3.select('#selDataset');
    d3.json(JsonPathURL).then(
        (data) => 
        {
            let names = data.names

            // Lists/creates each data.names selection into the dropdown menu list
            names.forEach(
                function(ID_Name) 
                { 
                    DrpDown.append('option').text(ID_Name).property('value', ID_Name); 
                    

                });

                // Check data is being accessed
                console.log("*");
                console.log('= Data Read Check =');
                console.log(data);
                console.log('= End Data Read Check =');
                console.log("*");

                // Initialize default plots for ID: 940
                PlotCharts(data.names[0]);
        });


}



///////// Initialization Function  /////////
init();


/////////  Build Charts Dynamically from data /////////
function PlotCharts(id) 
{
    
    d3.json(JsonPathURL).then(
        (data) => 
        {   
            var Samples = data.samples.filter(item => item.id.toString() === id)[0];
            var MetaData = data.metadata.filter(item => item.id.toString() === id)[0];
            console.log("*");
            console.log("= Sample/Metadata String Check =");
            console.log(Samples);
            console.log(MetaData);
            console.log("= End Sample/Metadata String Check =");
            console.log("*");

            
            
            /////////  Demographic InfoBox  /////////
            let NewValue =  DrpDown.property("value");
            let Demo_ID = MetaData.id
            let Demo_Ethnicity = MetaData.ethnicity
            let Demo_Gender = MetaData.gender
            let Demo_Age = MetaData.age
            let Demo_Location = MetaData.location
            let Demo_BBtype = MetaData.bbtype
            let Demo_Wfreq = MetaData.wfreq
            
            // Check if values are being read
            console.log("*");
            console.log("= Demo Check =");
            console.log('ID: '+ Demo_ID);
            console.log('Ethnicity: '+ Demo_Ethnicity);
            console.log('Gender: '+ Demo_Gender);
            console.log('Age: '+ Demo_Age);
            console.log('Location: '+ Demo_Location);
            console.log('BB Type: '+ Demo_BBtype);
            console.log('W Freq: '+ Demo_Wfreq);
            console.log("= End Demo Check =");
            console.log("*");

            
            
            // Clear contents of box on each change
            DemographicBox.html("")

            // Append and display above demographic data in each line of InfoBox html
            Object.entries(MetaData).forEach((key) => 
            {
                DemographicBox.append("p").text(key[0] + ": " + key[1])
            })



            /////////  Bar Chart  /////////
            // Get the top 10 samples (descending order)
            let BarSample_Values = Samples.sample_values.slice(0,10).reverse()

            // Get the top 10 OTU IDs (descending order)
            let BarOTU_IDs = Samples.otu_ids.slice(0,10).reverse()

            // Display of InfoBox data
            BarOTU_IDs = BarOTU_IDs.map(item => "OTU" + " " + item)

            // Get the top 10 plot labels
            let BarOTU_Labels = Samples.otu_labels.slice(0,10)

            console.log("*");
            console.log("= Bar Chart Values Check =");
            console.log(BarOTU_IDs);
            console.log(BarSample_Values);
            console.log("= End Bar Chart Values Check =");
            console.log("*");
            
            // Create Horizontal Bar Chart
            let BarTrace = 
            {
                x: BarSample_Values,
                y: BarOTU_IDs,
                text: BarOTU_Labels,
                type: "bar",
                orientation: "h"
            };

            
            // Create trace data
            let BarPlotData = [BarTrace];


            let BarLayout = 
            {
                title:"Top 10 OTUs",
                xaxis: {title: "Samples Collected"}
            };
            
            
            // Plot bar chart
            Plotly.newPlot('bar', BarPlotData, BarLayout, {responsive:true});

        



            /////////  Bubble Chart  /////////
            let BubbleSample_Values = Samples.sample_values
            let BubbleOTU_IDs = Samples.otu_ids
            let BubbleOTU_Labels = Samples.otu_ids

            console.log("*");
            console.log("= Bubble Chart Values Check =");
            console.log(BubbleOTU_IDs);
            console.log(BubbleSample_Values);
            console.log("= End Bubble Chart Values Check =");
            console.log("*");


            // Create Bubble Chart
            let BubbleTrace = 
            {
                x: BubbleOTU_IDs,
                y: BubbleSample_Values,
                mode: "markers",
                marker: {size: BubbleSample_Values, color: BubbleOTU_IDs, colorscale: "Rainbow"},

                text: BubbleOTU_Labels,
                text: {size: 50},
                type: "bubble"
                
            };

            
            // Create trace data
            let BubblePlotData = [BubbleTrace];


            let BubbleLayout = 
            {
                title:"Samples Bubble Chart",
                xaxis: {title: "OTU IDs"},
                yaxis: {title: "Samples Collected"}
            };
            
            
            // Plot Bubble chart
            Plotly.newPlot('bubble', BubblePlotData, BubbleLayout, {responsive:true});



            /////////  Gauge Speedometer Chart ///////// 
            console.log("*");
            console.log("= Gauge Chart Values Check =");
            console.log(Demo_Wfreq);
            console.log("= End Gauge Chart Values Check =");
            console.log("*");

            // Create Gauge chart based on readme example and Wash Frequency
            let SpeedometerTrace = 
            [
                
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: Demo_Wfreq,
                    title: 
                    {
                        text: "<b> Belly Button Washing Frequency </b> <br> Scrubs Per Week", font: { size: 20 }
                    },
                    type: "indicator",
                    mode: "gauge+number+delta",
                    
                    gauge: 
                    {
                        axis: {range: [null, 9]},
                        borderwidth: 1,
                        bordercolor: "white",
                        steps: 
                        [
                            { range: [0,1], color: "rgb(250, 243, 236)" },
                            { range: [1,2], color: "rgb(230, 235, 220)" },
                            { range: [2,3], color: "rgb(200, 230, 202)" },
                            { range: [3,4], color: "rgb(170, 231, 179)" },
                            { range: [4,5], color: "rgb(130, 228, 157)" },
                            { range: [5,6], color: "rgb(100, 204, 146)" },
                            { range: [6,7], color: "rgb(60, 191, 136)" },
                            { range: [7,8], color: "rgb(30, 187, 143)" },
                            { range: [8,9], color: "rgb(0, 150, 115)" }

                        ],

                        threshold: 
                        {
                            line: { color: "red", width: 6 },
                            thickness: 3,
                            value: Demo_Wfreq
                        },

                    }
                        
                }
                
            ];

            let SpeedometerPlotData = SpeedometerTrace;

            let SpeedometerLayout = 
            { 
                
                width: 600, 
                height: 450, 
                margin: { t: 0, b: 0, r: 100 }
            };

            var SPEEDOMETER = document.getElementById("gauge");
            Plotly.newPlot(SPEEDOMETER, SpeedometerPlotData, SpeedometerLayout, {responsive:true});
            

        });
}






/////////  Create event change/click for 'optionChanged' ID selections  /////////
function optionChanged(ID_Choice) {
    PlotCharts(ID_Choice);
}
