import { Component } from "react";
import { Col } from "antd";
import "../views/index.css";
import "antd/dist/antd.css";
import store from "../store";
import { Card } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { Area } from "@ant-design/charts";
let refresh = 0;
const DataCount: React.FC = () => {
  // 最近的30条
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
    // eslint-disable-next-line
  }, [refresh]);
  const asyncFetch = () => {
    fetch("/getDataCount")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  var config = {
    smooth: true,
    height: 127,
    data: data,
    xField: "value_type",
    yField: "count",
    isStack: true,
    autoFit: true,
    legend: {
      layout: "horizontal",
      position: "bottom",
    },
  };
  return <Area {...config} />;
};

class HeadCard2 extends Component {
  componentDidMount() {
    store.registerComponent("HeadCard2", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("HeadCard2", this);
  }
  render() {
    refresh = !refresh;
    return (
      <Col
        span={6}
        className="site-layout"
        style={{
          padding: 10,
          minHeight: "200",
          maxWidth: "100%",
        }}
      >
        <Card bordered={false} style={{ maxWidth: "99%" }}>
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
            <font size="4">接收数据量在时间上的分布</font>
          </div>
          <DataCount />
        </Card>
      </Col>
    );
  }
}

export default HeadCard2;
