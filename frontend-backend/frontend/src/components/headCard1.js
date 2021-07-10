import React, { Component } from "react";
import { Area } from "@ant-design/charts";
import { Col } from "antd";
import "../views/index.css";
import "antd/dist/antd.css";
import store from "../store";
import { Card } from "antd";
import { useEffect } from "react";
import { useState } from "react";
let refresh = 0;
const Page: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
    // eslint-disable-next-line
  }, [refresh]);
  const asyncFetch = () => {
    fetch("/getCount")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  var config = {
    data,
    height: 127,
    xField: "time",
    yField: "count",
    // point: {
    //   size: 5,
    //   shape: "diamond",
    // },
    // color: ["#82d1de", "#cb302d", "#e3ca8c"],
    autoFit: true,
    smooth: true,
    // xAxis: false,
  };
  return <Area {...config} />;
};

class HeadCard1 extends Component {
  componentDidMount() {
    store.registerComponent("HeadCard1", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("HeadCard1", this);
  }
  render() {
    refresh = !refresh;
    return (
      <Col
        span={6}
        className="site-layout"
        style={{
          maxHeight: "100",
          maxWidth: "100%",
          padding: 10,
        }}
      >
        <Card
          bordered={false}
          style={{
            maxHeight: "100",
            maxWidth: "99%",
            padding: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
              paddingBottom: 15,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <font size="4">设备数量随时间变化</font>
          </div>
          <Page />
        </Card>
      </Col>
    );
  }
}

export default HeadCard1;
