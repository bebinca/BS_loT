import { Component } from "react";
import { Col, Row } from "antd";
import "../views/index.css";
import "antd/dist/antd.css";
import store from "../store";
import { Card } from "antd";
import EditableTable from "./tableContent";

class HeadCard3 extends Component {
  componentDidMount() {
    store.registerComponent("HeadCard3", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("HeadCard3", this);
  }
  render() {
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
        <Row
          gutter={24}
          style={{
            maxHeight: "100%",
            paddingRight: 10,
            paddingLeft: 10,
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
            <EditableTable />
          </Card>
        </Row>
      </Col>
    );
  }
}

export default HeadCard3;
