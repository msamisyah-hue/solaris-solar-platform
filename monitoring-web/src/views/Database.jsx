/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { StatsCard__clock } from "components/StatsCard/StatsCard__clock.jsx";
import { StatsCard__weather } from "components/StatsCard/StatsCard__weather.jsx";
import { StatsCard__temperature } from "components/StatsCard/StatsCard__temperature.jsx";
import { StatsCard__humidity } from "components/StatsCard/StatsCard__humidity.jsx";

import TestChart from "components/Chart/TestChart.js"

import { Tasks } from "components/Tasks/Tasks.jsx";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar
} from "variables/Variables.jsx";

import clock from "assets/img/icons/clock.png";
import temperature from "assets/img/icons/temperature.png";
import humidity from "assets/img/icons/humidity.png";
import { isThisTypeNode } from "typescript";

import axios from'axios';
import SolarPowerIndicator from "components/Chart/SolarPowerIndicator";
import Controller_output from "components/Controller_output.js";
import Surface_temp_chart from "components/Chart/Surface_temp_chart";

import Divider from '@material-ui/core/Divider';
import DataBaseCard from "components/Card/DataBaseCard";
import LineChart from "components/Chart/LineChart";


class Dashboard extends Component {

  constructor(props){
    super(props);
    this.state = {
      lon:0,
      lat:0,
      time:"00:00:00",
      temperature:0,
      description:"",
      Weather:"",
      humidity:0
    }
  }
  componentWillMount(){
   this.get_initial_state()
   console.log(this.state) 
  }

  get_initial_state(){
    axios.get('http://api.openweathermap.org/data/2.5/weather?lat=40&lon=-86&appid=631834fd61a1d3309f1beefed08165e1')
    .then( response => response.data) // SUCCESS
    .then( weatherData => {
      if(weatherData){
        let _lon = weatherData.coord.lon;
        let _lat = weatherData.coord.lat;
        
        let _id = weatherData.weather[0].id;
        let _main = weatherData.weather[0].main;
        let _description = weatherData.weather[0].description;
        let _icon = weatherData.weather[0].icon;
        _icon = _icon.slice(0,2);
        
        let _temp = weatherData.main.temp;
        _temp = _temp - 273; // to celcious
        _temp = _temp*5/9 +32;
        _temp = _temp.toFixed(2);
        let _feels_like = weatherData.main.feels_like;
        let _temp_min = weatherData.main.temp_min;
        let _temp_max = weatherData.main.temp_max;
        let _pressure = weatherData.main.pressure;
        let _humidity = weatherData.main.humidity;
        
        let _wind_speed = weatherData.wind.speed;
        let _wind_deg = weatherData.wind.deg;
        let _wind_gust = weatherData.wind.gust;
        console.log(weatherData)
        
        this.setState({
          lon:_lon,
          lat:_lat,
          time:"00:00:00",
          temperature:_temp,
          description:_description,
          weather:_icon,
          humidity:_humidity
        })
      }
      // const oldBtcDataSet = this.state.lineChartData.datasets[0];
      // const newBtcDataSet = { ...oldBtcDataSet };
      // newBtcDataSet.data.push(this.getRandomValue());
  
      // const newChartData = {
      //   ...this.state.lineChartData,
      //   datasets: [newBtcDataSet],
      //   labels: this.state.lineChartData.labels.concat(
      //     new Date().toLocaleTimeString()
      //   )
      // };
      // this.setState({ lineChartData: newChartData });

      // 여기에 state 업데이트하는 부분

    })
    .catch( error => {
      console.log('OpenWeatherMap API unavailable or unauthorized. Loading local demo weather data:', error.message);
      this.setState({
        lon: -86.91,
        lat: 40.42,
        time: "00:00:00",
        temperature: "72.40",
        description: "Clear Sky",
        weather: "01",
        humidity: 42
      });
    });
  }



  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
        <Row>
        <Col md={6}>
              <DataBaseCard
                statsIcon="fa fa-history"
                id="chartHours"
                title="Solar Cell Chart"
                categosry="Real time"
                stats="Updated 15 seconds ago"
                isMixed="1"
              />       
            </Col>

            <Col md={6}>
              <DataBaseCard
                statsIcon="fa fa-history"
                id="chartHours"
                title="Battery Chart"
                categosry="Real time"
                stats="Updated 15 seconds ago"
                isMixed="1"
              />
              
            </Col>
{/* 
            <Col md={4}>
              <DataBaseCard
                statsIcon="fa fa-history"
                id="chartHours"
                title="Solar cell Suface temperature"
                categosry="Real time"
                stats="Updated 15 seconds ago"
              />
            </Col> */}
          </Row>



          <Row>
            <Col md={6}>
              <DataBaseCard
                statsIcon="fa fa-history"
                id="chartHours"
                title="Solar cell Suface temperature"
                categosry="Real time"
                stats="Updated 15 seconds ago"
                
                // content={
                //   // <div className="ct-chart">
                //   //   <ChartistGraph
                //   //     data={dataSales}
                //   //     type="Line"
                //   //     options={optionsSales}
                //   //     responsiveOptions={responsiveSales}
                //   //   />
                //   // </div>
                //   // <LineChart></LineChart>
                // }
                // legend={
                //   <div className="legend">{this.createLegend(legendSales)}</div>
                // }
              />
              
            </Col>
            <Col md={6}>
              <DataBaseCard
                statsIcon="fa fa-history"
                title="Charge Speed"
                stats="Updated 15 seconds ago"
                isMixed="1"
                // content={
                  // <div
                  //   id="chartPreferences"
                  //   className="ct-chart ct-perfect-fourth"
                  // >
                  //   <ChartistGraph data={dataPie} type="Pie" />
                  // </div>
                  // <TestChart></TestChart>
                // }
                // legend={
                //   <div className="legend">{this.createLegend(legendPie)}</div>
                // }
              />
            </Col>
            {/* <Col md={4}>
              <Card
                statsIcon="fa fa-history"
                title="Power gauge"
                category="the dynamic real-time power output from the solar array"
                stats="Real time"
                content={
                  // <div
                  //   id="chartPreferences"
                  //   className="ct-chart ct-perfect-fourth"
                  // >
                  //   <ChartistGraph data={dataPie} type="Pie" />
                  // </div>
                  <div>
                    <SolarPowerIndicator></SolarPowerIndicator>
                    <Divider></Divider>
                    <Controller_output></Controller_output>
                  </div>
                  // <TestChart></TestChart>
                }
                // legend={
                //   <div className="legend">{this.createLegend(legendSales)}</div>
                // }
              />
              
            </Col> */}



          </Row>


        </Grid>
      </div>
    );
  }
}

export default Dashboard;
