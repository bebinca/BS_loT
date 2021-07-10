import React, { Component } from "react";
import "antd/dist/antd.css";
import store from "../store";
import { Layout, Menu, Col } from "antd";
import "./index.css";
import HeadInfo from "../components/headInfo";
import MainInfo from "../components/mainInfo";
import {
  UserOutlined,
  // VideoCameraOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  RedoOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

class Main extends Component {
  componentDidMount() {
    store.registerComponent("Main", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("Main", this);
  }
  state = {
    collapsed: true,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logout = () => {
    fetch("/logout");
    store.handleChange.refreshData();
    store.handleChange.SetLogin(0);
    store.handleChange.SetDevice(null);
  };

  refresh = () => {
    store.refreshComponent("HeadInfo");
    store.refreshComponent("MainInfo");
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              Main
            </Menu.Item>
            {/* <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              User
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 2 }}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                {React.createElement(
                  this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: "trigger",
                    onClick: this.toggle,
                  }
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  paddingRight: 20,
                }}
              >
                <font size="5">Hello {store.getData.GetUserName()}!</font>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                  paddingRight: 20,
                }}
              >
                {React.createElement(RedoOutlined, {
                  className: "trigger",
                  onClick: this.refresh,
                })}
                {React.createElement(LogoutOutlined, {
                  className: "trigger",
                  onClick: this.logout,
                })}
              </div>
            </div>
          </Header>
          <Content className="site-layout">
            <Col className="site-layout" span={24}>
              <HeadInfo />
              <MainInfo />
            </Col>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default Main;
