import { Component } from "react";
import { Row } from "antd";
import "../views/index.css";
import "antd/dist/antd.css";
import store from "../store";
import HeadCard1 from "./headCard1";
import HeadCard2 from "./headCard2";
import HeadCard3 from "./headCard3";
import HeadCard4 from "./headCard4";

class HeadInfo extends Component {
  componentDidMount() {
    store.registerComponent("HeadInfo", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("HeadInfo", this);
  }
  render() {
    return (
      <Row
        gutter={10}
        className="site-layout"
        style={{
          padding: 24,
          width: "100%",
        }}
      >
        <HeadCard4 />
        <HeadCard1 />
        <HeadCard2 />
        <HeadCard3 />
      </Row>
    );
  }
}

export default HeadInfo;
