import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Button, Messsage, Spin, TreeSelect } from 'antd';
import { connect } from 'dva';
import styles from './AddEditProject.less';
// import CategoryTree from '../PersonTransferModal';
import { objKeyWrapper, newSubArr } from '../../utils/utils';
// import SelectInput from './publicSelect';
import PersonTransferModal from '../PersonTransferModal';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

@connect((state) => {
  return {
    searchFormFields: state.projectAdd.searchFormFields,
    organizeTree: state.projectList.organizeTree,
    personOrganizeTree: state.projectList.personOrganizeTree,
    projectDataInfo: state.projectInfo.projectDataInfo,
    isLoading: state.projectInfo.isLoading,
  };
})
@Form.create({
  mapPropsToFields(props) {
    return objKeyWrapper(props.searchFormFields, Form.createFormField);
  },
  onFieldsChange(props, fields) {
    props.dispatch({
      type: 'projectAdd/formFieldChange',
      payload: fields,
    });
  },
})


export default class AddEditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibal: this.props.visibal,
      type: this.props.type,
      editData: this.props.editData,
      showCategoryTree: false,
      currentSelectedIds: [],
      currentSelectedType: null,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visibal !== this.props.visibal) {
      this.setState({
        visibal: nextProps.visibal,
      });
    }
    if (nextProps.type !== this.props.type) {
      this.setState({
        type: nextProps.type,
      });
    }
    if (nextProps.editData !== this.props.editData) {
      this.setState({
        editData: nextProps.editData,
      }, () => {
        if (this.state.type == 'edit' || nextProps.type == 'edit') {
          const { dispatch } = this.props;
          dispatch({
            type: 'projectInfo/fetchData',
            payload: { id: nextProps.editData.id || undefined },
          });
        }
      });
    }
  }
  onManageModalOk = async (selectedIds) => {
    await this.props.dispatch({
      type: 'projectAdd/changeSelectPer',
      payload: {
        user_ids: selectedIds,
        selectType: this.state.currentSelectedType,
      },
    });
    this.setState({
      showCategoryTree: false,
    });
  }
  onManageModalCancal = () => {
    this.setState({
      showCategoryTree: false,
    });
  }

  handlesCancel() {
    this.setState({
      // showCategoryTree: false,
    });
    this.props.form.resetFields();
    this.props.handleCancel('addEdit');
  }

  // 取消
  handleCancel() {
    this.props.handleCancel('addEdit');
    if (this.state.type == 'edit') {
      return;
    }
    this.props.dispatch({
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
  // 新增/编辑表单提交
  handleSubmit(e) {
    e.preventDefault();
    const { editData, type } = this.state;
    const { id } = editData;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'projectAdd/projectAdd',
          payload: {
            id: type && type == 'edit' ? id : '',
            type: this.state.type,
            // department_id: values.department_id.split('-')[1],
            // desc: values.desc,
            // project_name: values.project_name,
            // develop_user_id: newSubArr(values.develop_user_id).join(','),
            // ops_user_id: newSubArr(values.ops_user_id).join(','),
            // other_user_id: newSubArr(values.other_user_id).join(','),
            // product_manager_id: newSubArr(values.product_manager_id).join(','),
            // supervisor_id: newSubArr(values.supervisor_id).join(','),
            // test_user_id: newSubArr(values.test_user_id).join(','),
          },
          values,
        });
      }
    });
  }


  // 控制显示组织类目树
  showTree = (bol, item, type) => {
    if (!this.controlBtn && this.controlBtn !== undefined) {
      return;
    }
    this.setState({
      showCategoryTree: true,
      currentSelectedIds: item,
      currentSelectedType: type,
    });
    this.select.blur();
    this.controlBtn = true;
  }
  // 失去焦点改变状态
  changeBtnStatus() {
    this.controlBtn = true;
  }

  // 删除输入框已选择的人员
  deleteChecked(e) {
    this.controlBtn = false;
    this.select.blur();
  }
  disabledCheck=() => {
    console.log('编辑模式下不允许修改人员');
  }
  // 渲染部门选择类型树
  renderTreeNodes = (treeData) => {
    const resultTreeNodes = treeData.map((nodeItem, index) => {
      return (
        <TreeNode
          key={nodeItem.id}
          title={nodeItem.fullName}
          value={nodeItem.id}
        >
          {nodeItem.children ? this.renderTreeNodes(nodeItem.children) : null}
        </TreeNode>
      );
    });
    return resultTreeNodes;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const textAreaLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const {
      categoryTreeData,
      projectDataInfo,
      isLoading,
      organizeTree,
      searchFormFields,
      personOrganizeTree } = this.props;
    const { currentSelectedIds, type } = this.state;
    const formLabel = {
      supervisor_id: '负责人',
      product_manager_id: '产品经理',
      ops_user_id: '运维人员',
      develop_user_id: '技术开发',
      test_user_id: '测试人员',
      other_user_id: '其他人员',
    };
    const formNodes = [];
    Object.keys(formLabel).forEach((key, index) => {
      formNodes.push(
        <FormItem
          {...formItemLayout}
          label={formLabel[key]}
        >
          {getFieldDecorator(key, {
            rules: [{
              required: key !== 'other_user_id', message: `请选择${formLabel[key]}`,
            }],
          })(
            <TreeSelect
              ref={(c) => { this.select = c; }}
              disabled={type == 'edit'}
              dropdownStyle={{ visibility: 'hidden' }}
              treeCheckable
              onClick={type == 'edit' ? this.disabledCheck : this.showTree.bind(this,
              true,
              searchFormFields[key] ? searchFormFields[key].value : '',
              key)}
              onBlur={::this.changeBtnStatus}
              onDeselect={::this.deleteChecked}
              placeholder="请选择"
            >
              {this.renderTreeNodes(personOrganizeTree)}
            </TreeSelect>
        )}
        </FormItem>);
    });

    return (
      <div>
        <Modal
          title={type === 'edit' ? '编辑项目' : '新增项目'}
          visible={this.state.visibal}
          onCancel={::this.handleCancel}
          width="800px"
          footer={null}
          className={styles.wrapper}
        >
          <Spin spinning={isLoading}>
            <Form onSubmit={::this.handleSubmit}>
              <Row gutter={24}>
                <Col span={12} >
                  <FormItem
                    label="项目名称"
                    {...formItemLayout}
                  >
                    {getFieldDecorator(
                    'project_name', {
                      initialValue: searchFormFields ? searchFormFields.project_name : '',
                      rules: [{
                        required: true, message: '请输入项目名称',
                      }, {
                        max: 30, message: '输入超过30个字符限制',
                      }, {
                        pattern: /^[A-Za-z]+$/g, message: '项目名称为英文',
                      }],
                    })(
                      <Input placeholder="请输入" disabled={type == 'edit'} />
                  )}
                  </FormItem>
                </Col>
                <Col span={12} >
                  <FormItem
                    label="所属部门"
                    {...formItemLayout}
                  >
                    {getFieldDecorator(
                    'department_id', {
                      // initialValue: searchFormFields ? searchFormFields.department_name : '',
                      rules: [{
                        required: true, message: '请选择所属部门',
                      }],
                    }
                  )(
                    <TreeSelect
                      disabled={type == 'edit'}
                      placeholder="请选择"
                    >
                      {this.renderTreeNodes(organizeTree)}
                    </TreeSelect>
                  )}
                  </FormItem>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12} >
                  {formNodes[0]}
                </Col>

                <Col span={12} >
                  {formNodes[1]}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12} >
                  {formNodes[2]}
                </Col>

                <Col span={12} >
                  {formNodes[3]}
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12} >
                  {formNodes[4]}
                </Col>

                <Col span={12} >
                  {formNodes[5]}
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem
                    label="描述"
                    {...textAreaLayout}
                  >
                    {getFieldDecorator('desc', {
                      initialValue: searchFormFields ? searchFormFields.desc : '',
                      rules: [{
                        required: true, message: '请输入描述',
                      }],
                    },
                  )(
                    <TextArea rows={4} />
                  )}
                  </FormItem>
                </Col>
              </Row>
              <div className={styles.btnWrapper}>
                <Button type="primary" onClick={::this.handleSubmit} >确定{type == 'edit' ? '编辑' : '新增'}</Button>
                <span style={{ display: 'inline-block', width: '20px' }} />
                <Button onClick={::this.handleCancel}>取消</Button>
              </div>
            </Form>
          </Spin>

          <PersonTransferModal
            visible={this.state.showCategoryTree}
            loading={false}
            // loading={modalLoading}
            treeData={personOrganizeTree}
            selectedIds={currentSelectedIds}
            // visible={this.state.manageModalVisible}
            onOk={this.onManageModalOk}
            onCancel={this.onManageModalCancal}
          />

        </Modal>
      </div>
    );
  }
}
