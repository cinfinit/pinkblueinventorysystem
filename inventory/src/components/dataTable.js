import { Table, Input, Button, Popconfirm, Form } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import "./login.css";

import Axios from "axios";
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        // return;
        this.toggleEdit();
        handleSave({ ...record });
      } else {
        this.toggleEdit();
        handleSave({ ...record, ...values });
      }
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`
            }
          ],
          initialValue: record[dataIndex]
        })(
          <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onBlur={this.save}
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };
  componentDidMount = () => {
    if (this.props.location) {
    }
  };
  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  componentDidMount = () => {
    let data = this.props.dataSource;
    if (this.props.location) {
      // console.log("location", this.props.location.state);
    }

    console.log("data", data);
  };
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Product Id",
        dataIndex: "ProductId",
        // width: "30%",
        editable: this.props.editAllowed
      },
      {
        title: "Product Name",
        dataIndex: "ProductName",
        editable: this.props.editAllowed
      },
      {
        title: "Vendor",
        dataIndex: "Vendor",
        editable: this.props.editAllowed
      },
      {
        title: "Batch Num",
        dataIndex: "BatchNum",
        editable: this.props.editAllowed
      },
      {
        title: "Batch Date",
        dataIndex: "BatchDate",
        editable: this.props.editAllowed
      },
      {
        title: "Quantity",
        dataIndex: "Quantity",
        editable: this.props.editAllowed
      },
      {
        title: "Status",
        dataIndex: "Status",
        editable: this.props.permission ? true : false
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          ) : null
      }
    ];

    this.state = {
      dataSource: this.props.dataSource
    };
  }

  checkData = () => {
    Axios.post("https://inventory-firebase.herokuapp.com/setdata", {
      data: this.state.dataSource
    }).then(res => {
      console.log("changes have been made to database successfully ");
      alert("you data has been updated");
    });
    console.log(this.state.dataSource);
  };

  handleDelete = key => {
    if (this.props.uid === "manager") {
      const dataSource = [...this.state.dataSource];
      this.setState({
        dataSource: dataSource.filter(item => item.key !== key)
      });
    } else {
      let data = [...this.state.dataSource];
      let dataChanged = data.filter(item => item.key === key);
      dataChanged[0].Status = "Permisson for deletion";
      let newData = data.filter(item => item.key !== key);
      console.log("newData", newData);
      //   newData.push(dataChanged);
      let finalDataSource = [...newData, ...dataChanged];
      this.setState({ dataSource: finalDataSource });
    }
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    if (this.state.dataSource.length < 1) {
      if (this.props.uid === "manager") {
        let newData = {
          key: 0,
          ProductId: 1,
          ProductName: 1,
          Vendor: 1,
          BatchNum: 1,
          BatchDate: 1,
          Quantity: 1,
          Status: "approved"
        };
        this.setState({
          dataSource: [...dataSource, newData]
          //   count: count + 1
        });
      } else {
        let newData = {
          key: 0,
          ProductId: 1,
          ProductName: 1,
          Vendor: 1,
          BatchNum: 1,
          BatchDate: 1,
          Quantity: 1,
          Status: "pending"
        };
        this.setState({
          dataSource: [...dataSource, newData]
          //   count: count + 1
        });
      }
    } else {
      if (this.props.uid === "manager") {
        let newData = {
          ...this.state.dataSource[this.state.dataSource.length - 1]
        };
        newData.key = this.state.dataSource.length;
        //recent change made
        newData.Status = "approved";

        this.setState({
          dataSource: [...dataSource, newData]
          //   count: count + 1
        });
      } else {
        let newData = {
          ...this.state.dataSource[this.state.dataSource.length - 1]
        };
        newData.key = this.state.dataSource.length;
        newData.Status = "pending";

        this.setState({
          dataSource: [...dataSource, newData]
          //   count: count + 1
        });
      }
    }
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div>
        {this.props.num === 1 && (
          <h1 style={{ textAlign: "center" }}>Inventory data </h1>
        )}
        {this.props.num === 2 && (
          <h1 style={{ textAlign: "center" }}>Modify/Edit Inventory Data </h1>
        )}
        {this.props.num === 3 && (
          <h1 style={{ textAlign: "center" }}>Grant/Revoke Permissons </h1>
        )}
        <div style={{ backgroundColor: "white" }}>
          <Table
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            columns={columns}
          />
        </div>
        <br />
        {this.props.num === 2 && (
          <Button
            onClick={this.handleAdd}
            className="login-form-button"
            style={{ marginBottom: 16 }}
          >
            Add a row
          </Button>
        )}
        &emsp;
        {(this.props.num === 2 || this.props.num === 3) && (
          <Button className="login-form-button" onClick={this.checkData}>
            Save Data
          </Button>
        )}
        &emsp;
        <Link
          to={{
            pathname: "/dashboard",
            state: { uid: this.props.uid, editAllowed: this.props.editAllowed }
          }}
        >
          <Button className="login-form-button"> Return to dashboard</Button>
        </Link>
      </div>
    );
  }
}

export default EditableTable;
