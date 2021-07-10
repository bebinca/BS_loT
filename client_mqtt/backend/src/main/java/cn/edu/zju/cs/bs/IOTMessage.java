package cn.edu.zju.cs.bs;

import lombok.Data;

@Data
public class IOTMessage {
    //设备ID
    private String clientId;

    private int id;
    //上报信息
    private String info;
    //设备数据
    private int value;
    //是否告警，0-正常，1-告警
    private int alert;
    //设备位置，经度
    private double lng;
    //设备位置，纬度
    private double lat;
    //上报时间，ms
    private long timestamp;

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public void setAlert(int alert) {
        this.alert = alert;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
