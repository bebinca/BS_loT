import { Component } from "react";
import { Card } from "antd";
import store from "../store";
import {
  LayerEvent,
  AMapScene,
  PointLayer,
  LineLayer,
  Popup,
} from "@antv/l7-react";
import React from "react";
let refresh = 0;
const MapScene1: React.FC = () => {
  const [data, setData] = React.useState();
  const [popupInfo, setPopupInfo] = React.useState();
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refresh]);
  const fetchData = () => {
    fetch("/getPos")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  function showPopup(args) {
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature,
    });
    console.log(args);
  }
  return (
    <AMapScene
      option={{ logoVisible: false }}
      map={{
        pitch: 0,
        mapStyle: "amap://styles/whitesmoke",
        center: [120.2, 30.26],
        token: "8fab98243fa703aba497ec924404efd6",
        zoom: 9.7,
        maxZoom: 20,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {popupInfo && (
        <Popup lnglat={popupInfo.lnglat}>
          {popupInfo.feature.properties.device_name}
          <ul
            style={{
              margin: 0,
            }}
          >
            <li>info:{popupInfo.feature.properties.info}</li>
            <li>value:{popupInfo.feature.properties.val}</li>
          </ul>
        </Popup>
      )}
      {data && (
        <PointLayer
          key={"2"}
          source={{
            data: data,
            parser: {
              type: "geojson",
            },
          }}
          size={{
            field: "val",
            values: [10, 15],
          }}
          color={{
            field: "alert",
            values: (alert) => {
              return alert ? "#E8684A" : "#5B8FF9";
            },
          }}
          shape={{
            values: "circle",
          }}
          style={{
            opacity: 0.3,
            strokeWidth: 1,
          }}
          active={{
            option: true,
          }}
        >
          <LayerEvent type="mousemove" handler={showPopup} />
        </PointLayer>
      )}
    </AMapScene>
  );
};
const MapScene2: React.FC = () => {
  const [data, setData] = React.useState();
  const [popupInfo, setPopupInfo] = React.useState();
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [refresh]);
  const fetchData = () => {
    let id = store.getData.GetSelect();
    let content = { id: id };
    fetch("/get_history_geo", {
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
  function showPopup(args) {
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature,
    });
    console.log(args);
  }
  return (
    <AMapScene
      option={{ logoVisible: false }}
      map={{
        pitch: 0,
        mapStyle: "amap://styles/whitesmoke",
        center: [120.2, 30.26],
        token: "8fab98243fa703aba497ec924404efd6",
        zoom: 10,
        maxZoom: 20,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {popupInfo && (
        <Popup lnglat={popupInfo.lnglat}>
          {/* {popupInfo.feature.properties.timesta} */}
          <ul
            style={{
              margin: 0,
            }}
          >
            <li>info:{popupInfo.feature.properties.info}</li>
            <li>value:{popupInfo.feature.properties.val}</li>
          </ul>
        </Popup>
      )}
      {data && (
        <LineLayer
          key={"3"}
          source={{
            data: data[0],
            parser: {
              type: "geojson",
            },
          }}
          size={{
            values: 1.5,
          }}
          color={{
            values: "#5B8FF9",
          }}
          shape={{
            values: "line",
          }}
          style={{
            opacity: 1,
            strokeWidth: 1,
          }}
          active={{
            option: true,
          }}
        />
      )}
      {data && (
        <PointLayer
          key={"2"}
          source={{
            data: data[1],
            parser: {
              type: "geojson",
            },
          }}
          size={{
            field: "timesta",
            values: [5, 20],
          }}
          color={{
            field: "alert",
            values: (alert) => {
              return alert ? "#E8684A" : "#5B8FF9";
            },
          }}
          shape={{
            values: "circle",
          }}
          style={{
            opacity: 0.3,
            strokeWidth: 1,
          }}
          active={{
            option: true,
          }}
        >
          <LayerEvent type="mousemove" handler={showPopup} />
        </PointLayer>
      )}
    </AMapScene>
  );
};
class MapCard extends Component {
  componentDidMount() {
    store.registerComponent("MapCard", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("MapCard", this);
  }
  render() {
    refresh = !refresh;
    if (store.getData.GetSelect() === "0" || store.getData.GetSelect() === 0) {
      return (
        <Card bordered={false} style={{ height: "99%", width: "100%" }}>
          <MapScene1 />
        </Card>
      );
    } else {
      return (
        <Card bordered={false} style={{ height: "99%", width: "100%" }}>
          <MapScene2 />
        </Card>
      );
    }
  }
}
export default MapCard;
