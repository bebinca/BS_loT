import React, { useContext, useState, useEffect, useRef } from "react";
import "antd/dist/antd.css";
import "../views/index.css";
import { Table, Input, Button, Popconfirm, Form } from "antd";
import store from "../store";
const EditableContext = React.createContext(null);
var refresh = 0;
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

async function add_device() {
  const { count, dataSource } = store.getComponent("EditableTable").state;
  var id = null;
  var devicename = null;
  await fetch("/addDevice")
    .then((response) => response.json())
    .then((json) => {
      id = json["id"];
      devicename = json["name"];
      console.log("id" + id);
      console.log("name" + devicename);
      console.log(json);
    })
    .catch((error) => {
      console.log("addDevice failed", error);
    });
  var newData = {
    key: id,
    name: devicename,
  };
  store.getComponent("EditableTable").setState({
    dataSource: [...dataSource, newData],
    count: count + 1,
  });
  store.refreshComponent("MainInfo");
  store.refreshComponent("HeadCard1");
  store.refreshComponent("HeadCard2");
  store.refreshComponent("HeadCard4");
}

class EditableTable extends React.Component {
  componentDidMount() {
    store.registerComponent("EditableTable", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("EditableTable", this);
  }
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "name",
        dataIndex: "name",
        width: "80%",
        editable: true,
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              {/* eslint-disable-next-line */}
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];
  }

  state = {
    dataSource: null,
    count: 0,
  };

  handleDelete = (key) => {
    refresh = 1;
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
    let content = { key: key };
    fetch("/deleteDevice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("delete" + json);
      });

    store.refreshComponent("MainInfo");
    store.refreshComponent("HeadCard1");
    store.refreshComponent("HeadCard2");
    store.refreshComponent("HeadCard4");
  };

  handleAdd = () => {
    refresh = 1;
    add_device();
  };
  handleSave = (row) => {
    refresh = 1;
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    console.log(index);
    const item = newData[index];
    console.log(item);
    newData.splice(index, 1, { ...item, ...row });
    console.log(newData[index]);
    fetch("/updateDevice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData[index]),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("save" + json);
      });
    this.setState({
      dataSource: newData,
    });
    store.refreshComponent("MainInfo");
  };

  render() {
    // eslint-disable-next-line
    if (refresh === 0) this.state.dataSource = store.getData.GetDevice();
    else refresh = 0;
    // eslint-disable-next-line
    this.state.count = this.state.dataSource ? this.state.dataSource.length : 0;
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
          size="small"
        >
          Add a device
        </Button>
        <Table
          bordered
          components={components}
          rowClassName={() => "editable-row"}
          dataSource={dataSource}
          columns={columns}
          size="small"
          showHeader={false}
          scroll={{ y: 130 }}
          pagination={{ position: ["none", "none"] }}
        />
      </div>
    );
  }
}

export default EditableTable;
