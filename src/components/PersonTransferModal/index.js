import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Modal, Tree, Button, Tag, Spin, Input } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import { treeTravel } from '../../utils/utils';

const { TreeNode } = Tree;
const { Search } = Input;

export default class CategoryTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: undefined,
      treeData: props.treeData || [],
      selectedIds: props.selectedIds || [],
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    });
  }

  onCheck = (checkedKeys, info) => {
    // console.log(checkedKeys, info);
    const { checkedNodes } = info;
    this.setState({
      selectedIds: checkedKeys,
    });
  }
  onOk = () => {
    if (this.props.onOk) {
      this.props.onOk(this.state.selectedIds);
    }
  }
  onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }
  treeFilter = (treeNode) => {
    if (treeNode.props.title.indexOf(this.state.filterValue) > -1) {
      return true;
    }
  }
  treeSearch = (value) => {
    this.setState({
      filterValue: value,
    });
  }
  //  tree渲染
  renderTreeNodes = (orgTreeData) => {
    // console.log('orgTreeData:', orgTreeData);
    const resultTreeNodes = orgTreeData.map((nodeItem, index) => {
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
  // 渲染选中的人员
  renderSelectedItems = () => {
    const { treeData, selectedIds } = this.state;
    const selectedPersons = [];
    const columns = [{
      title: '序号',
      key: 'k',
      render: (text, record, index) => {
        return index + 1;
      },
    }, {
      title: '姓名',
      dataIndex: 'fullName',
      key: 'fullName',
    }];
    if (selectedIds) {
      treeTravel(treeData, (nodeItem) => {
        // 搜集所有选中的人的节点
        if (
          nodeItem.nodeType === 3
          && selectedIds.map((item) => {
            return `${item}`;
          }).indexOf(`${nodeItem.id}`) > -1) {
          selectedPersons.push(nodeItem);
        }
      });
    }

    return (
      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedIds,
          onChange: (selectedRowKeys, selectedRows) => {
            // 这里selectedRowKeys是包含父节点的全量数据，需要通过 selectedRows 获得节点数据
            const nodeSelected = selectedRows.map((item) => {
              return item.id;
            });
            this.setState({
              selectedIds: nodeSelected,
            });
          },
        }}
        checkable
        bordered={false}
        dataSource={selectedPersons}
        columns={columns}
        pagination={false}
      />
    );
  }
  render() {
    const { visible, loading } = this.props;
    // console.log('selectedIds:', this.state.selectedIds);
    return (
      <Modal
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        width={800}
      >
        <Spin spinning={loading}>
          <p>人员选择</p>
          <div className={styles.wrapper}>
            <div className={styles.leftConent}>
              <Search onSearch={this.treeSearch} />
              <Tree
                checkable
                defaultExpandAll
                checkedKeys={this.state.selectedIds}
                filterTreeNode={this.treeFilter}
                onCheck={this.onCheck}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </div>
            <div className={styles.rightConent} >
              {this.renderSelectedItems()}
            </div>
          </div>
        </Spin>
      </Modal>
    );
  }
}

