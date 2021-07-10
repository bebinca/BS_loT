import { Component } from "react";
import { Statistic, Col, Row } from "antd";
import "../views/index.css";
import "antd/dist/antd.css";
import store from "../store";
import { Card } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { Bullet } from "@ant-design/charts";
let refresh = 0;
const StaOnline: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getOnline();
    // eslint-disable-next-line
  }, [refresh]);
  const getOnline = () => {
    fetch("/getOnlineCountNow")
      .then((response) => response.json())
      .then((json) => {
        setData(json["count"]);
      })
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  var config = {
    value: data,
    title: "在线设备",
  };
  return <Statistic {...config} />;
};
const StaCount: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    getCount();
    // eslint-disable-next-line
  }, [refresh]);
  const getCount = () => {
    fetch("/getCountNow")
      .then((response) => response.json())
      .then((json) => {
        setData(json["count"]);
      })
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  var config = {
    value: data,
    title: "现有设备",
  };
  return <Statistic {...config} />;
};
const MyBullet: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
    // eslint-disable-next-line
  }, [refresh]);
  const asyncFetch = () => {
    fetch("/getOnlinePercentNow")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  var config = {
    height: 96,
    data: data,
    measureField: "measures",
    rangeField: "ranges",
    targetField: "target",
    xField: "title",
    color: {
      range: "#f0efff",
      measure: "#5B8FF9",
      target: "#3D76DD",
    },
    xAxis: { line: null },
    yAxis: {
      tickMethod: function tickMethod(_ref) {
        var max = _ref.max;
        var interval = Math.ceil(max / 5);
        return [0, interval, interval * 2, interval * 3, interval * 4, max];
      },
    },
  };
  return <Bullet {...config} />;
};
class HeadCard4 extends Component {
  componentDidMount() {
    store.registerComponent("HeadCard4", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("HeadCard4", this);
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
          <Row
            style={{
              minHeight: "200",
              maxWidth: "100%",
            }}
          >
            <Col
              span={12}
              style={{
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
                minHeight: "200",
                maxWidth: "100%",
              }}
            >
              <StaCount />
            </Col>
            <Col
              span={12}
              style={{
                paddingBottom: 10,
                paddingLeft: 10,
                paddingRight: 10,
                minHeight: "200",
                maxWidth: "100%",
              }}
            >
              <StaOnline />
            </Col>
          </Row>

          <MyBullet />
        </Card>
      </Col>
    );
  }
}

export default HeadCard4;
