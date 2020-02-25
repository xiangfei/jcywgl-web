import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Input, Form, Row, Col, Button, DatePicker, Paginatio, TreeSelect } from 'antd';
import { AddEditProject, ProjectName } from '../../components/ProjectListModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './ProjectList.less';
// import { table } from '../../../mock/project-list';
import { objKeyWrapper } from '../../utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;
const PAGE_SIZE = 20;

@connect((state) => {
  return {
    listInfo: state.projectList.listInfo,
    msg: state.projectList.msg,
    showProjectInfo: state.projectList.showProjectInfo,
    projectInfoData: state.projectList.projectInfoData,
    searchFormFields: state.projectList.searchFormFields,
    organizeTree: state.projectList.organizeTree,
    projectId: state.projectList.projectId,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, changedFields) {
    props.dispatch({
      type: 'projectList/formFieldChange',
      payload: changedFields,
    });
  },
})
export default class ProjectList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibal: false,
      showProjectInfo: false,
      type: '',
      editData: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/fetch',
      payload: {
        page: 1,
        page_size: PAGE_SIZE,
      },
    });
    // 加载到部门
    dispatch({
      type: 'projectList/fetchOrganizeTree',
      payload: {
        withPerson: false,
        loadType: 'department',
      },
    });
    // 加载到人
    dispatch({
      type: 'projectList/fetchOrganizeTree',
      payload: {
        withPerson: true,
        loadType: 'person',
      },
    });
  }
  // 跳转到服务列表
  pageChangeHandler(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/saveProjectId',
      payload: {
        projectId: id,
      },
    });
    dispatch(routerRedux.push('/project/service-list'));
  }

  // 分页加载数据
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

  // 表单搜索提交
  handleSearch(e, page) {
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

  // 重置搜索表单
  handleReset() {
    this.props.dispatch({
      type: 'projectList/reste',
      payload: {
        projectName: {
          value: undefined,
        },
        createTime: {
          value: undefined,
        },
        department_id: {
          value: undefined,
        },
        organizational_id: {
          value: undefined,
        },
      },
    });
  }

  // 请求后端table数据
  fetchData(item) {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/fetch',
      payload: item,
    });
  }

  // 判断新增/编辑和项目信息modal
  addEdit(cache, item, type) {
    switch (cache) {
      case 'projectInfo':
        this.setState({
          showProjectInfo: true,
          id: item.id,
        });
        break;
      case 'addEdit':
        if (item == 'add') {
          const { dispatch } = this.props;
          dispatch({
            type: 'projectAdd/resetFiledsValue',
            payload: {
              searchFormFields: {
                project_name: {// 项目名称
                  value: undefined,
                },
                department_name: {// 所属部门
                  value: undefined,
                },
                supervisor_name: {// 负责人
                  value: undefined,
                },
                product_manager_name: {// 产品经理
                  value: undefined,
                },
                ops_user_name: {// 运维人员
                  value: undefined,
                },
                develop_user_name: {// 技术开发
                  value: undefined,
                },
                test_user_name: {// 测试人员
                  value: undefined,
                },
                other_user_name: {// 其他人员
                  value: undefined,
                },
                desc: {// 描述
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
  // 关闭对话框
  handleCancel(cache) {
    switch (cache) {
      case 'projectInfo':
        this.setState({
          showProjectInfo: false,
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

  // 增加项目
  addProject(item, reset) {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/addProject',
      payload: item,
      callback: reset,
    });
  }

  // 编辑项目
  editProject(item, reset) {
    const { dispatch } = this.props;
    dispatch({
      type: 'projectList/editProject',
      payload: item,
      callback: reset,
    });
  }
  // 渲染部门选择类型树
  renderTreeNodes = (treeData) => {
    const resultTreeNodes = treeData.map((nodeItem, index) => {
      return (
        <TreeNode
          key={nodeItem.id}
          title={nodeItem.fullName}
          value={nodeItem.id.toString()}
        >
          {nodeItem.children ? this.renderTreeNodes(nodeItem.children) : null}
        </TreeNode>
      );
    });
    return resultTreeNodes;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { listInfo, showProjectInfo, projectInfoData, organizeTree } = this.props;
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
      title: '项目名称',
      dataIndex: 'project_name',
      key: 'project_name',
      render: (text, record) => {
        return (<a onClick={this.addEdit.bind(this, 'projectInfo', record)}>{text}</a>);
      },
    }, {
      title: '所属部门',
      dataIndex: 'department_id',
      key: 'department_id',
    }, {
      title: '所属集团',
      dataIndex: 'organizational_id',
      key: 'organizational_id',
    }, {
      title: '服务数量',
      dataIndex: 'service_num',
      key: 'service_num',
    }, {
      title: '负责人',
      dataIndex: 'leader_id',
      key: 'leader_id',
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    }, {
      title: '当前版本号',
      dataIndex: 'version_num',
      key: 'version_num',
    }, {
      title: '创建时间',
      dataIndex: 'date_joined',
      key: 'date_joined',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a style={{ paddingRight: '10px' }} onClick={this.pageChangeHandler.bind(this, record.id)}>服务</a>
            <a onClick={this.addEdit.bind(this, 'addEdit', record, 'edit')}>编辑</a>
          </span>
        );
      },
    }];

    return (
      <PageHeaderLayout>
        <div>
          <h2>项目列表</h2>
          <div className={styles.wrapper}>
            <Form
              onSubmit={::this.handleSearch}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                <Col xl={8} lg={24}>
                  <FormItem
                    {...formItemLayout}
                    label="项目名称"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('projectName')(
                      <Input placeholder="请输入" />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="创建时间"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('createTime')(
                      <RangePicker
                        showTime={{
                          hideDisabledOptions: true,
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                        }}
                        format="YYYY-MM-DD HH:mm:ss"
                        // onChange={::this.onDateChange}
                      />
                    )}
                  </FormItem>
                </Col>

                <Col xl={8} lg={24}>
                  <FormItem
                    {...formItemLayout}
                    label="所属部门"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('department_id')(
                      // <Input placeholder="请输入" />
                      <TreeSelect placeholder="请选择">
                        {this.renderTreeNodes(organizeTree)}
                      </TreeSelect>
                    )}
                  </FormItem>
                </Col>

                <Col xl={8} lg={24}>
                  <FormItem
                    {...formItemLayout}
                    label="所属集团"
                    className={styles.labelStyle}
                  >
                    {getFieldDecorator('organizational_id')(
                      <TreeSelect placeholder="请选择">
                        {this.renderTreeNodes(organizeTree)}
                      </TreeSelect>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span={24} >
                  <Button type="primary" htmlType="submit" onClick={::this.handleSearch}>搜索</Button>
                  <Button className={styles.btn} onClick={::this.handleReset}>清除</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.btnWrapper}>
            <p className={styles.leftBtn}>{`共搜索到 ${listInfo.pagination.total} 条数据`}</p>
            <Button className={styles.rightBtn} type="primary" onClick={this.addEdit.bind(this, 'addEdit', 'add')}>新增项目</Button>
          </div>
          <Table
            columns={columns}
            dataSource={listInfo.list}
            loading={listInfo.loading}
            onChange={::this.paginationChange}
            pagination={{
              total: listInfo.pagination.total,
              pageSize: listInfo.pagination.pageSize,
              current: listInfo.pagination.currentPage,
              // showSizeChanger: true,
              // showQuickJumper: true,
            }}
          />
          <AddEditProject
            visibal={this.state.visibal}
            type={this.state.type}
            editData={this.state.editData}
            handleCancel={::this.handleCancel}
            // addProject={::this.addProject}
            // editProject={::this.editProject}
          />
          <ProjectName
            visibal={this.state.showProjectInfo}
            id={this.state.id}
            // projectInfoData={projectInfoData}
            handleCancel={::this.handleCancel}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
