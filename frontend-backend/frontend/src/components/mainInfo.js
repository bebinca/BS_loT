import { Component } from "react";
import { Row } from "antd";
import "../views/index.css";
import "antd/dist/antd.css";
import store from "../store";
import { Col } from "antd";
import Search from "./search";
import ValueCard from "./valueCard";
import MapCard from "./mapCard";

class MainInfo extends Component {
  componentDidMount() {
    store.registerComponent("MainInfo", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("MainInfo", this);
  }
  render() {
    return (
      <Row
        gutter={14}
        className="site-layout"
        style={{
          paddingRight: 36,
          paddingLeft: 36,
          minHeight: "200",
          width: "100%",
        }}
      >
        <Col
          span={8}
          className="site-layout-background"
          style={{ minHeight: "200", maxWidth: "100%" }}
        >
          <Row
            gutter={16}
            className="site-layout-background"
            style={{ paddingLeft: 20, paddingRight: 30, paddingTop: 20 }}
          >
            {/* <Card bordered={false}>Card content</Card> */}
            <Search />
          </Row>
          <Row gutter={16} className="site-layout-background">
            <ValueCard />
          </Row>
        </Col>
        <Col
          span={16}
          className="site-layout-background"
          style={{ minHeight: "200", maxWidth: "100%", padding: 20 }}
        >
          {/* <Card bordered={false}>Card content</Card> */}
          <MapCard />
        </Col>
      </Row>
    );
  }
}

export default MainInfo;
