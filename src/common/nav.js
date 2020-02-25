import React from 'react';
import dynamic from 'dva/dynamic';
import { Link, Route, Redirect, Switch } from 'dva/router';
// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      // {
      //   name: 'Dashboard',
      //   icon: 'dashboard',
      //   path: 'dashboard',
      //   children: [
      //     {
      //       name: '分析页',
      //       path: 'analysis',
      //       component: dynamicWrapper(app, ['chart'],
      // () => import('../routes/Dashboard/Analysis')),
      //     },
      //     {
      //       name: '监控页',
      //       path: 'monitor',
      //       component: dynamicWrapper(app, ['monitor'],
      // () => import('../routes/Dashboard/Monitor')),
      //     },
      //     {
      //       name: '工作台',
      //       path: 'workplace',
      //       component: dynamicWrapper(app, ['project', 'activities', 'chart'],
      //  () => import('../routes/Dashboard/Workplace')),
      //     },
      //   ],
      // },
      // {
      //   name: '表单页',
      //   path: 'form',
      //   icon: 'form',
      //   children: [
      //     {
      //       name: '基础表单',
      //       path: 'basic-form',
      //       component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
      //     },
      //     {
      //       name: '分步表单',
      //       path: 'step-form',
      //       component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
      //       children: [
      //         {
      //           path: 'confirm',
      //           component: dynamicWrapper(app, ['form'],
      //  () => import('../routes/Forms/StepForm/Step2')),
      //         },
      //         {
      //           path: 'result',
      //           component: dynamicWrapper(app, ['form'],
      // () => import('../routes/Forms/StepForm/Step3')),
      //         },
      //       ],
      //     },
      //     {
      //       name: '高级表单',
      //       path: 'advanced-form',
      //       component: dynamicWrapper(app, ['form'],
      // () => import('../routes/Forms/AdvancedForm')),
      //     },
      //   ],
      // },
      // {
      //   name: '表格',
      //   path: 'list',
      //   icon: 'table',
      //   children: [
      //     {
      //       name: '查询表格',
      //       path: 'table-list',
      //       component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
      //     },
      //     {
      //       name: '标准列表',
      //       path: 'basic-list',
      //       component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
      //     },
      //     {
      //       name: '卡片列表',
      //       path: 'card-list',
      //       component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
      //     },
      //     {
      //       name: '搜索列表（项目）',
      //       path: 'cover-card-list',
      //       component: dynamicWrapper(app, ['list'],
      // () => import('../routes/List/CoverCardList')),
      //     },
      //     {
      //       name: '搜索列表（应用）',
      //       path: 'filter-card-list',
      //       component: dynamicWrapper(app, ['list'],
      // () => import('../routes/List/FilterCardList')),
      //     },
      //     {
      //       name: '搜索列表（文章）',
      //       path: 'search',
      //       component: dynamicWrapper(app, ['list'], () => import('../routes/List/SearchList')),
      //     },
      //   ],
      // },
      // {
      //   name: '详情页',
      //   path: 'profile',
      //   icon: 'profile',
      //   children: [
      //     {
      //       name: '基础详情页',
      //       path: 'basic',
      //       component: dynamicWrapper(app, ['profile'],
      // () => import('../routes/Profile/BasicProfile')),
      //     },
      //     {
      //       name: '高级详情页',
      //       path: 'advanced',
      //       component: dynamicWrapper(app, ['profile'],
      // () => import('../routes/Profile/AdvancedProfile')),
      //     },
      //   ],
      // },
      // {
      //   name: '结果',
      //   path: 'result',
      //   icon: 'check-circle-o',
      //   children: [
      //     {
      //       name: '成功',
      //       path: 'success',
      //       component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
      //     },
      //     {
      //       name: '失败',
      //       path: 'fail',
      //       component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
      //     },
      //   ],
      // },
      {
        // name: '异常', // 不显示在左侧导航
        path: 'exception',
        icon: 'warning',
        children: [
          {
            name: '403',
            path: '403',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
          },
          {
            name: '404',
            path: '404',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '500',
            path: '500',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
          },
        ],
      },
      // 业务代码
      {
        name: '项目管理',
        path: 'project',
        icon: 'appstore-o',
        children: [
          {
            name: '项目列表',
            path: 'project-list',
            component: dynamicWrapper(app, ['project-list', 'checked-tree', 'project-info', 'project-add'], () => import('../routes/ProjectManage/ProjectList')),
          },
          {
            name: '公共服务列表',
            path: 'base-list',
            component: dynamicWrapper(app, ['service-list'], () => import('../routes/ProjectManage/BaseList')),
          },
          {
            // name: '服务列表',
            path: 'service-list',
            component: dynamicWrapper(app, ['service-list', 'service-info', 'service-add', 'project-list'], () => import('../routes/ProjectManage/ServiceList')),
          },
        ],
      },
      {
        name: '用户管理',
        path: 'user-manage',
        icon: 'user',
        children: [
          {
            name: '用户管理',
            path: 'userlist',
            component: dynamicWrapper(app, ['user-manage'], () => import('../routes/UserManage/UserList')),
          },
          {
            name: '角色管理',
            path: 'rolelist',
            component: dynamicWrapper(app, ['role-manage'], () => import('../routes/UserManage/RoleList')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        // name: '帐户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
          // {
          //   name: '注册',
          //   path: 'register',
          //   component: dynamicWrapper(app, ['register'],
          // () => import('../routes/User/Register')),
          // },
          // {
          //   name: '注册结果',
          //   path: 'register-result',
          //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
          // },
        ],
      },
    ],
  },
  // {
  //   component: dynamicWrapper(app, [], () => import('../layouts/BlankLayout')),
  //   layout: 'BlankLayout',
  //   children: {
  //     name: '使用文档',
  //     path: 'http://pro.ant.design/docs/getting-started',
  //     target: '_blank',
  //     icon: 'book',
  //   },
  // },
];
