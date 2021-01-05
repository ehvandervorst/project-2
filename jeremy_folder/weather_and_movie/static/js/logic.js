d3.csv("/static/data/nyc_weather_5_years.csv").then(generateChart);

function generateChart(weather){

  var date = weather.map(function(d){return d.DATE;});
  var precipitation = weather.map(function(d){return d.PRCP;});
  var snow = weather.map(function(d){return d.SNOW;});
  var avgTemp = weather.map(function(d){return d.TAVG;});

  var lineChart = new Chart(document.getElementById("lineChart"),{
    type:'line',
    data:{
      labels: date,
      datasets:[{
          data: precipitation,
          label: "Precipitation levels"
        },
        {
          data: snow,
          label: "Snow Levels"
        },
        {
          data: avgTemp,
          label: "Average Temperature (in Fahrenheit)"
        },
      ]
    },
    options: {
      title: {
        display: true,
        text: "Weather in New York City from the last 5 years"
      }
    }
  });

}