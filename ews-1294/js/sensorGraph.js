function show_sensorlog(){
  
  alert("hellosensor log");

        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);


        var app = {};
        option = null;

        var date = []
        var data = []

        //Set two variables for min-max date ranges - used to set length of Marker lines (Alert/Warning levels)
        var alertThreshold = sensorRecentData.alertThreshold
        var warningThreshold = sensorRecentData.warningThreshold

        //populate the data and date arrays with records from JSON response file.
        for (i = 0; i < sensorRecentData.record.length; i++) { 
        	data.push(sensorRecentData.record[i].height); //Y Axis
        	date.push(sensorRecentData.record[i].timestamp) //X Axis
        	}




        var dateRangeStart = date[0];
        var dateRangeEnd = date[date.length - 1];
        var graphTitle = "EWS Sensor Water Heights - " + sensorRecentData.sensorName;
        //console.log(sensorRecentData);


        option = {
            tooltip: {
                trigger: 'axis',
                 position: function (pos, params, el, elRect, size) {
                        var obj = {top: 10};
                        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                        return obj;
                    }
            },
            title: {
                left: 'center',
                text: graphTitle,
            },
            toolbox: {
                feature: {
                    dataZoom: {
        				show : false,
                        yAxisIndex: 'none'
                    },
                    restore: {
        			 show : false},
                    saveAsImage: {
        			 show: false,
        			 title : 'Save Image'}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
           // dataZoom: [{
           //     type: 'inside',
           //     start: 0,
           //     end: 100 //this is percentage of total data retrieval to show as zooomed in/out.
           // },   {
           //     start: 0,
           //     end: 30,
           //     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
           //     handleSize: '100%',
           //     handleStyle: {
           //         color: '#fff',
           //         shadowBlur: 3,
            //        shadowColor: 'rgba(0, 0, 0, 0.6)',
            //        shadowOffsetX: 2,
            //        shadowOffsetY: 2
            //    }
            //}],
            series: [
                {
                    name:'Water Level',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(240,248,255)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(0, 191, 255)'
                            }, {
                                offset: 1,
                                color: 'rgb(0, 0, 128)'
                            }])
                        }
                    },
                    data: data,
        			
        			markLine: {
        			name:'Warning',
                    type:'line',
                    smooth:true,
        			data: [[                 
                   { // start point of the line
                    xAxis: dateRangeStart, // we have to defined line attributes only here (not in the end point)
                    yAxis: warningThreshold,
                    lineStyle: {
                      normal: {
                        color: "#ffb200"
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: 'end',
                        formatter: 'Warning'
                      }
                    }
                  },
                  // end point of the line
                  {
                    xAxis: dateRangeEnd,
                    yAxis: warningThreshold,
                    
        				  }	  
        				  
        				  
        				  
        				],
        		
        		[                 
                   { // start point of the Alert line
                    xAxis: dateRangeStart, // we have to defined line attributes only here (not in the end point)
                    yAxis: alertThreshold,
                    lineStyle: {
                      normal: {
                        color: "#ff2323"
                      }
                    },
                    label: {
                      normal: {
                        show: true,
                        position: 'end',
                        formatter: 'Alert'
                      }
                    }
                  },
                  // end point of the alert line
                  {
                    xAxis: dateRangeEnd,
                    yAxis: alertThreshold,
                    
        				  }	  
        				  
        				  
        				  
        				]	
        				
        				
        				
        			  ]
        			}	


        			
                }
        		 
            ]
        };
        ;
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }


}



if(external_id!=null){
  
    var external_id=GetURLParameter("external_id");
    var sensorRecentData={};
    // call api 
    $.ajax({
      url:"http://localhost:8000/api/v1/sensors/" +external_id+"/datapoints/10",
      dataType: "json",
      success: function(response){
          sensorRecentData=response;
    // call function show graph 
                show_sensorlog();


      }
    });

}


// Get value variable from url
function GetURLParameter(sParam)

{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam)
         {

          return sParameterName[1];

        }

    }

}
