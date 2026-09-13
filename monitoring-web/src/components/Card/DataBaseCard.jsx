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
import LineChart from "components/Chart/LineChart";
import React, {useState} from 'react'
import Mixed_lineChart from "components/Chart/Mixed_lineChart";
export default function DataBaseCard(props){

  // If externalPeriod is provided by a parent, use it; otherwise manage locally
  const [localPeriod, setLocalPeriod] = useState("L1H")
  const timePeriod = props.externalPeriod || localPeriod;

  const onChangeTimePeroid = e => {
    let selectBox = e.target
    setLocalPeriod(selectBox.options[selectBox.selectedIndex].value)
  }

  // const setLineChartState = timePeriod => {
  //   setTimePeroid(timePeriod)
  // }


    // When used with externalPeriod (Analytics page), render chart only — no legacy card chrome
    if (props.externalPeriod) {
      return (
        <div>
          {props.isMixed === "1"
            ? <Mixed_lineChart timePeriod={timePeriod} lable={props.title} />
            : <LineChart timePeriod={timePeriod} lable={props.title} />
          }
        </div>
      );
    }

    return (
      <div className={"card" + (props.plain ? " card-plain" : "")}>
        <div className={"header" + (props.hCenter ? " text-center" : "")}>
          <h4 className="title">{props.title}</h4>
          <p className="category">{props.category}</p>
          {/* Only show local selector when not driven by external period */}
          <select
            name="time_period"
            onChange={onChangeTimePeroid}
            style={{
              fontSize: "13px", padding: "4px 8px", borderRadius: "6px",
              border: "1px solid var(--solaris-border)", background: "#f8fafc",
              color: "var(--solaris-text-secondary)", marginTop: "6px", cursor: "pointer"
            }}
          >
            <option value="L1H">Last 1 hour</option>
            <option value="L3H">Last 3 hours</option>
            <option value="L6H">Last 6 hours</option>
            <option value="L12H">Last 12 hours</option>
            <option value="LD">Last day</option>
            <option value="LW">Last week</option>
            <option value="LM">Last month</option>
          </select>
        </div>
        <div className="content">
          {props.isMixed === "1"
            ? <Mixed_lineChart timePeriod={timePeriod} lable={props.title} />
            : <LineChart timePeriod={timePeriod} lable={props.title} />
          }
          <div className="footer">
            {props.legend}
            {props.stats != null ? <hr /> : ""}
            <div className="stats">
              <i className={props.statsIcon} /> {props.stats}
            </div>
          </div>
        </div>
      </div>
    );
  
}

