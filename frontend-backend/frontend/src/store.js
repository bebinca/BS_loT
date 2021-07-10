import { Component } from "react";

const getall = () => {
  fetch("/getDeviceTable")
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      store.handleChange.SetDevice(json);
      store.refreshComponent("HeadCard3");
      console.log(store.state.device);
    })
    .catch((error) => {
      console.log("getDeviceTable failed", error);
    });
};

class Store {
  state = {
    userId: null,
    userName: "",
    password: "",
    email: "",
    login: 0,
    select: 0,
    signup: 0,
    device: null,
  };
  debug = 0;

  getData = {
    GetUserId: () => {
      return this.state.userId;
    },
    GetLogin: () => {
      fetch("/status").then((response) => {
        //console.log(response);
      });
      return this.state.login;
    },
    GetUserName: () => {
      return this.state.userName;
    },
    GetPassWord: () => {
      return this.state.password;
    },
    GetSelect: () => {
      return this.state.select;
    },
    GetDevice: () => {
      return this.state.device;
    },
    GetSignup: () => {
      return this.state.signup;
    },
    GetEmail: () => {
      return this.state.email;
    },
  };

  handleChange = {
    SetLogin: (num) => {
      this.state.login = num;
      this.refreshComponent("App");
    },
    SetSignup: (num) => {
      this.state.signup = num;
      this.refreshComponent("SignIn");
    },
    SetUserId: (num) => {
      this.state.userId = num;
    },
    SetUser: (username, password) => {
      this.state.userName = username;
      this.state.password = password;
    },
    SetUserName: (username) => {
      this.state.userName = username;
    },
    SetUserPwd: (pwd) => {
      this.state.password = pwd;
    },
    SetSelect: (select) => {
      this.state.select = select["value"];
      this.refreshComponent("MapCard");
      this.refreshComponent("ValueCard");
    },
    SetDevice: (device) => {
      this.state.device = device;
    },
    SetEmail: (email) => {
      this.state.email = email;
    },
    refreshData: () => {
      getall();
    },
  };

  userLogin(state, userId) {
    state.userId = userId;
  }

  userLogout(state) {
    state.userId = null;
  }

  components = {};

  getComponent(str) {
    return this.components[str];
  }

  registerComponent(str, component) {
    if (!(component instanceof Component) || !(typeof str === "string")) return;
    this.components[str] = component;
    if (!component.state || !component.state.storeAutoRefresh)
      component.setState({ storeAutoRefresh: true });
  }

  unregisterComponent(str, component) {
    if (!(component instanceof Component) || !(typeof str === "string")) return;
    if (this.components[str] === component) this.components[str] = undefined;
  }

  refreshComponent(str) {
    if (!(typeof str === "string")) return;
    if (str === "HeadInfo" || str === "App") this.handleChange.refreshData();
    if (this.components.hasOwnProperty(str)) {
      console.log("refresh: " + str);
      this.components[str].setState((state) => ({
        storeAutoRefresh: !state.storeAutoRefresh,
      }));
    }
  }
}

const store = new Store();

export default store;
