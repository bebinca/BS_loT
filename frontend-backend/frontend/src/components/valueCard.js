import React, { Component } from "react";
import { Column, Line } from "@ant-design/charts";
// import { Area, Line, Column } from "@ant-design/charts";
import { Col } from "antd";
import "../views/index.css";
import "antd/dist/antd.css";
import store from "../store";
import { Card } from "antd";
import { useEffect } from "react";
import { useState } from "react";
let refresh = 0;
const AllValue: React.FC = () => {
  // 最近的30条
  const [data, setData] = useState([]);
  useEffect(() => {
    const asyncFetch = () => {
      let id = store.getData.GetSelect();
      let content = { id: id };
      fetch("/get_history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      })
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => {
          console.log("fetch data failed", error);
        });
    };
    asyncFetch();
    // eslint-disable-next-line
  }, [refresh]);

  var config = {
    height: 350,
    smooth: false,
    data: data,
    xField: "timesta",
    yField: "val",
    xAxis: {
      range: [0, 1],
    },
    point: {
      size: 5,
      shape: "diamond",
    },
  };
  return <Line {...config} />;
};

const AllValue1: React.FC = () => {
  // 最近的30条
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
    // eslint-disable-next-line
  }, [refresh]);
  const asyncFetch = () => {
    fetch("/getAllValue1")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  var config = {
    height: 350,
    smooth: false,
    data: data,
    xField: "value_type",
    yField: "count",
    seriesField: "name",
    isStack: true,
    legend: {
      layout: "horizontal",
      position: "bottom",
    },
  };
  return <Column {...config} />;
};

class ValueCard extends Component {
  componentDidMount() {
    store.registerComponent("ValueCard", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("ValueCard", this);
  }
  render() {
    refresh = !refresh;
    if (store.getData.GetSelect() === "0" || store.getData.GetSelect() === 0) {
      return (
        <Col
          span={24}
          className="site-layout"
          style={{ padding: 0, maxWidth: "99%" }}
        >
          <Card bordered={false} style={{ maxWidth: "100%" }}>
            <AllValue1 />
          </Card>
        </Col>
      );
    } else {
      return (
        <Col
          span={24}
          className="site-layout"
          style={{ padding: 0, maxWidth: "99%" }}
        >
          <Card bordered={false} style={{ maxWidth: "100%" }}>
            <AllValue />
          </Card>
        </Col>
      );
    }
  }
}

export default ValueCard;
