import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Input, Form, Row, Col, Button, DatePicker, Popconfirm, Modal } from 'antd';
import { AddEditService, ServiceName } from '../../components/ServiceListModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ServiceList.less';
import { objKeyWrapper } from '../../utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const PAGE_SIZE = 20;
@connect((state) => {
  return {
    listInfo: state.serviceList.listInfo,
    searchFormFields: state.serviceList.searchFormFields,
    projectId: state.projectList.projectId,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'serviceList/formFieldChange',
      payload: fields,
    });
  },
})

export default class ServiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibal: false,
      showServiceName: false,
      type: '',
      editData: '',
    };
  }
  componentDidMount() {
    const { dispatch, projectId } = this.props;
    if (!projectId) {
      dispatch(routerRedux.push('/project/project-list/'));
      return;
    }
    dispatch({
      type: 'serviceList/reste',
      payload: {
        serviceName: {
          value: undefined,
        },
      },
    });
    dispatch({
      type: 'serviceList/loadListData',
      payload: {
        page: 1,
        page_size: PAGE_SIZE,
        project_id: this.props.projectId,
      },
    });
  }

  // 请求后端table数据
  fetchData(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceList/loadListData',
      payload: item,
    });
  }
  // 分页查询
  paginationChange(page) {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 格式化搜索框日期
        const rangeTimeValue = values.createTime;
        const fieldsValue = {
          ...values,
          page: page.current,
          page_size: PAGE_SIZE,
          starttime: rangeTimeValue ? rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
          endtime: rangeTimeValue ? rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        };
        this.fetchData(fieldsValue);
      }
    });
  }

  // 搜索提交
  handleSearch(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 格式化搜索框日期
        const rangeTimeValue = values.createTime;
        const fieldsValue = {
          ...values,
          page: 1,
          page_size: PAGE_SIZE,
          starttime: rangeTimeValue ? rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
          endtime: rangeTimeValue ? rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss') : undefined,
        };
        this.fetchData(fieldsValue);
      }
    });
  }

  // 重置
  handleReset = () => {
    this.props.dispatch({
      type: 'serviceList/reste',
      payload: {
        serviceName: {
          value: undefined,
        },
        createTime: {
          value: undefined,
        },
      },
    });
  }

  addEdit(cache, item, type) {
    switch (cache) {
      case 'serviceName':
        this.setState({
          showServiceName: true,
          id: item.id,
        });
        break;
      case 'addEdit':
        if (item == 'add') {
          this.props.dispatch({
            type: 'serviceAdd/resetFiledsValue',
            payload: {
              searchFormFields: {
                module_tech: {
                  value: undefined,
                },
                module_name: {
                  value: undefined,
                },
                module_path: {
                  value: undefined,
                },
                logs_path: {
                  value: undefined,
                },
                port: {
                  value: undefined,
                },
                module_type: {
                  value: undefined,
                },
                publicservice: {
                  value: undefined,
                },
                desc: {
                  value: undefined,
                },
              },
            },
          });
        }

        this.setState({
          visibal: true,
          type,
          editData: item || '',
        });
        break;
      default:
        break;
    }
  }

  handleCancel(cache) {
    switch (cache) {
      case 'serviceName':
        this.setState({
          showServiceName: false,
        });
        break;
      case 'addEdit':
        this.setState({
          visibal: false,
        });
        break;
      default:
        break;
    }
  }

  // 确认停用
  handleConfirm(item) {
    confirm({
      title: '你确定要停用此用户? ',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'serviceList/deleteService',
          payload: {
            id: item.id,
          },
        });
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { listInfo, projectId } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };

    const columns = [{
      title: '序号',
      key: 'id',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '服务名称',
      dataIndex: 'module_name',
      key: 'module_name',
      render: (text, record) => <a onClick={this.addEdit.bind(this, 'serviceName', record)}>{text}</a>,
    }, {
      title: '技术栈',
      dataIndex: 'module_tech',
      key: 'module_tech',
    }, {
      title: '版本号',
      dataIndex: 'version_num',
      key: 'version_num',
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: '创建时间',
      dataIndex: 'date_joined',
      key: 'date_joined',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a onClick={this.addEdit.bind(this, 'addEdit', record, 'edit')}>编辑</a>
            <a style={{ paddingLeft: '10px' }} onClick={this.handleConfirm.bind(this, record)}>停用</a>
          </span>
        );
      },
    }];

    return (
      <PageHeaderLayout>
        <div>
          <h2>服务列表-当前项目名称</h2>
          <div className={styles.wrapper}>
            <Form
              onSubmit={::this.handleSearch}
            >
              <Row gutter={24}>
                <Col span={8} >
                  <FormItem
                    {...formItemLayout}
                    label="服务名称"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('serviceName')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                </Col>

                <Col span={8} >
                  <FormItem
                    {...formItemLayout}
                    label="创建时间"
                  >
                    {getFieldDecorator('createTime')(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24} >
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button className={styles.btn} onClick={::this.handleReset}>清除</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
            <Button className={styles.rightBtn} type="primary" onClick={this.addEdit.bind(this, 'addEdit', 'add')}>新增服务</Button>
          </div>
          <Table
            loading={listInfo.isLoading}
            columns={columns}
            dataSource={listInfo.list}
            onChange={::this.paginationChange}
            pagination={{
              total: listInfo.pagination.total,
              pageSize: listInfo.pagination.pageSize,
              current: listInfo.pagination.currentPage,
            }}
          />
          <AddEditService
            visibal={this.state.visibal}
            handleCancel={::this.handleCancel}
            type={this.state.type}
            editData={this.state.editData}
          />
          <ServiceName
            visibal={this.state.showServiceName}
            handleCancel={::this.handleCancel}
            id={this.state.id}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
