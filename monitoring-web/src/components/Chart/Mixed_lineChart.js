// https://www.chartjs.org/docs/latest/
// https://blog.bitsrc.io/customizing-chart-js-in-react-2199fa81530a


import React from "react";
import { withStyles } from "@material-ui/core/styles";
import RealTimeChart from "./RealTimeChart";
import axios from "axios";

// https://codesandbox.io/s/wq5jwmkw8k?from-embed

const styles = theme => ({
  "chart-container": {
    height: 600,
    width: 750
  }
});

class Mixed_lineChart extends React.Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: this.props.first_lable,
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: "#DC143C",
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: "3",
          lineTension: 0.45,
          data: []
        },        
        {
          type: "line",
          label: this.props.second_lable,
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: "#6495ED",
          pointBorderColor: "#6495ED",
          borderWidth: "3",
          lineTension: 0.45,
          data: []
        }
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        ],
        yAxes: [{
          // ticks: {
          //     max: 1000,
          //     min: 0,
          //     stepSize: 10
          // }
      }]
      }
    }
  };

  componentWillMount(){
    // Initial load
  }
  componentDidMount() {
    this.getDataFromDatabase(this.props.timePeriod);
  }
  componentWillReceiveProps(prop){
    this.getDataFromDatabase(prop.timePeriod)
  }
  getDataFromDatabase(_timePeriod){
    if(this.props.lable == "Solar Cell Chart"){
      axios.get('http://localhost:3001/controller_info_last_'+_timePeriod)
      .then( response => response.data) // SUCCESS
      .then( controller_infos => {
        if(controller_infos){
          // console.log(Object.values(solar_infos))
          let solar_voltage = controller_infos.map( controller_info => controller_info.solar_voltage.toFixed(2))
          let solar_current = controller_infos.map( controller_info => controller_info.solar_current.toFixed(2))
          let _labels = controller_infos.map(controller_info => controller_info.timestamp.slice(5,19)) 
          // labels 
          // console.log(temperatures)
          // console.log(_labels)

          // console.log(...this.state.lineChartData)

          const newChartData = {
            ...this.state.lineChartData,
            datasets:         [{
              type: "line",
              label: "Tension Cellule Solaire (V)",
              backgroundColor: "rgba(0, 0, 0, 0)",
              borderColor: "#DC143C",
              pointBackgroundColor: this.props.theme.palette.secondary.main,
              pointBorderColor: this.props.theme.palette.secondary.main,
              borderWidth: "3",
              lineTension: 0.45,
              data: solar_voltage
            },        
            {
              type: "line",
              label: "Courant Cellule Solaire (A)",
              backgroundColor: "rgba(0, 0, 0, 0)",
              borderColor: this.props.theme.palette.primary.main,
              pointBackgroundColor: "#6495ED",
              pointBorderColor: "#6495ED",
              borderWidth: "3",
              lineTension: 0.45,
              data: solar_current
            }],
            labels: _labels
          };
          this.setState({ lineChartData: newChartData });
          // console.log(this.state)
        }
      })
      .catch( response => { console.log(response); }); // ERROR
      // let weatherData = this.fetchTempFromAPI()
      // console.log(weatherData)
    }
    if(this.props.lable == "Battery Chart"){
      axios.get('http://localhost:3001/controller_info_last_'+_timePeriod)
      .then( response => response.data) // SUCCESS
      .then( controller_infos => {
        if(controller_infos){
          // console.log(Object.values(solar_infos))
          let battery_voltage = controller_infos.map( controller_info => controller_info.battery_voltage.toFixed(2))
          let battery_current = controller_infos.map( controller_info => controller_info.battery_current.toFixed(2))
          let _labels = controller_infos.map(controller_info => controller_info.timestamp.slice(5,19)) 
          // labels 
          // console.log("555555555555555")
          // console.log(battery_voltage)
          // console.log(battery_current)
          // console.log(_labels)
          // console.log("555555555555555")
          // console.log(...this.state.lineChartData)

          const newChartData = {
            ...this.state.lineChartData,
            datasets:         [{
              type: "line",
              label: "Tension Batterie (V)",
              backgroundColor: "rgba(0, 0, 0, 0)",
              backgroundColor: "rgba(0, 0, 0, 0)",
              borderColor: "#DC143C",
              pointBackgroundColor: this.props.theme.palette.secondary.main,
              borderWidth: "3",
              lineTension: 0.45,
              data: battery_voltage
            },        
            {
              type: "line",
              label: "Courant Batterie (A)",
              backgroundColor: "rgba(0, 0, 0, 0)",
              borderColor: this.props.theme.palette.primary.main,
              pointBackgroundColor: "#6495ED",
              pointBorderColor: "#6495ED",
              borderWidth: "3",
              lineTension: 0.45,
              data: battery_current
            }],
            labels: _labels
          };
          this.setState({ lineChartData: newChartData });
          // console.log(this.state)
        }
      })
      .catch( response => { console.log(response); }); // ERROR
      // let weatherData = this.fetchTempFromAPI()
      // console.log(weatherData)
    }

    
    if(this.props.lable == "Charge Speed"){
 
      axios.get('http://localhost:3001/solar_info_last_'+_timePeriod)
      .then( response => response.data) // SUCCESS
      .then( solar_infos => {
        if(solar_infos){
          console.log(solar_infos)
          let _temperatures = solar_infos.map(solar_info => solar_info.temperature.toFixed(2))
          let _labels = solar_infos.map(solar_info => solar_info.timestamp.slice(5,19)) 
  
        axios.get('http://localhost:3001/controller_info_last_'+_timePeriod)
          .then( response => response.data) // SUCCESS
          .then( controller_outputs => {
            if(controller_outputs){
              let _yield_kwhs = controller_outputs.map(controller_output => controller_output.yield_kwh.toFixed(2));
              console.log(_yield_kwhs)
              
              const newChartData = {
                ...this.state.lineChartData,
                datasets:         [{
                  type: "line",
                  label: "Vitesse de Charge (kWh)",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  borderColor: "#DC143C",
                  pointBackgroundColor: this.props.theme.palette.secondary.main,
                  borderWidth: "3",
                  lineTension: 0.45,
                  data: _yield_kwhs
                },        
                {
                  type: "line",
                  label: "Température Surface (°C)",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  borderColor: this.props.theme.palette.primary.main,
                  pointBackgroundColor: "#6495ED",
                  pointBorderColor: "#6495ED",
                  borderWidth: "3",
                  lineTension: 0.45,
                  data: _temperatures
                }],
                labels: _labels
              };
              this.setState({ lineChartData: newChartData });
              // console.log(this.state)
            }
          })
          .catch( response => { console.log(response); }); // ERROR
          // let weatherData = this.fetchTempFromAPI()
          // console.log(weatherData)
        }
  
      })
      .catch( response => { console.log(response); }); // ERROR
      // let weatherData = this.fetchTempFromAPI()
      // console.log(weatherData)




    }

  }


  render() {

    const { classes } = this.props;

    return (
      <div className={classes["chart-container"]}>    
  {/* <p>{this.state.rec}</p> */}
        <RealTimeChart
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        ></RealTimeChart>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Mixed_lineChart);
