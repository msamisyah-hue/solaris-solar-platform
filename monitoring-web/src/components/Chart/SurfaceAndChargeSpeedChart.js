import React from "react";
import { withStyles } from "@material-ui/core/styles";
import RealTimeChart from "./RealTimeChart";
import axios from "axios";

const styles = theme => ({
  "chart-container": {
    height: 488.05,
    width: 470
  }
});

class SurfaceAndChargeSpeedChart extends React.Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "Température Surface (°C)",
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
          label: "Vitesse de Charge (kWh)",
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
      tooltips: { enabled: true },
      scales: {
        xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 10 } }],
        yAxes: [{}]
      }
    }
  };

  componentDidMount() {
    setInterval(() => this.updateData(), 10000);
  }

  updateData() {
    axios.get("http://localhost:3001/solar_info_last")
      .then(response => response.data[0])
      .then(solar_info => {
        if (!solar_info) return;
        const _temperature = solar_info.temperature.toFixed(2);
        const oldTempSet = this.state.lineChartData.datasets[0];
        const newTempSet = { ...oldTempSet, data: [...oldTempSet.data, _temperature] };

        axios.get("http://localhost:3001/controller_info_last")
          .then(response => response.data[0])
          .then(controller_output => {
            if (!controller_output) return;
            const _yield_kwh = controller_output.yield_kwh;
            const oldYieldSet = this.state.lineChartData.datasets[1];
            const newYieldSet = { ...oldYieldSet, data: [...oldYieldSet.data, _yield_kwh] };

            const newChartData = {
              ...this.state.lineChartData,
              datasets: [newTempSet, newYieldSet],
              labels: this.state.lineChartData.labels.concat(
                new Date().toLocaleTimeString("fr-FR")
              )
            };
            this.setState({ lineChartData: newChartData });
          })
          .catch(() => {});
      })
      .catch(() => {});
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes["chart-container"]}>
        <RealTimeChart
          data={this.state.lineChartData}
          options={this.state.lineChartOptions}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SurfaceAndChargeSpeedChart);
