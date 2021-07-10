import React, { Component } from "react";
import "antd/dist/antd.css";
import "../views/index.css";
import { Select } from "antd";
import store from "../store";
import fetchJsonp from "fetch-jsonp";
const { Option } = Select;
const querystring = require("querystring");
let timeout;
let currentValue;
function getall(callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  function fake() {
    const str = querystring.encode({
      code: "utf-8",
    });
    fetchJsonp(`/getDevice?${str}`)
      .then((response) => {
        return response.json();
      })
      .then((d) => {
        const { item } = d;
        const data = [];
        item.forEach((r) => {
          data.push({
            value: r["deviceId"],
            text: r["name"],
          });
        });
        callback(data);
      });
  }
  timeout = setTimeout(fake, 300);
}
function search(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    const str = querystring.encode({
      code: "utf-8",
      deviceName: value,
    });
    fetchJsonp(`/searchDevice?${str}`)
      .then((response) => {
        return response.json();
      })
      .then((d) => {
        if (currentValue === value) {
          const { item } = d;
          const data = [];
          item.forEach((r) => {
            data.push({
              value: r["deviceId"],
              text: r["name"],
            });
          });
          callback(data);
        }
      });
  }
  timeout = setTimeout(fake, 300);
}
function onBlur() {
  console.log("blur");
}

class Search extends Component {
  state = {
    data: [],
    value: undefined,
  };
  onFocus = () => {
    console.log("focus");
    getall((data) => this.setState({ data }));
  };
  handleSearch = (value) => {
    if (value) {
      search(value, (data) => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = (value) => {
    console.log(value);
    this.setState({ value });
    store.handleChange.SetSelect({ value });
  };

  render() {
    const options = this.state.data.map((d) => (
      <Option key={d.value}>{d.text}</Option>
    ));
    return (
      <Select
        showSearch
        value={this.state.value}
        style={{ width: "100%" }}
        placeholder="Select a device"
        optionFilterProp="value"
        onChange={this.handleChange}
        onFocus={this.onFocus}
        onBlur={onBlur}
        onSearch={this.handleSearch}
        notFoundContent={null}
        filterOption={false}
        // filterOption={(input, option) =>
        //   option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        // }
      >
        <Option key={0}>{"All"}</Option>
        {options}
      </Select>
    );
  }
}

export default Search;
