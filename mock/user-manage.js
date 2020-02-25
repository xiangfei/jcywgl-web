import { getUrlParams } from './utils';

export const list = {
  code: 200,
  msg: '用户数据获取成功',
  data: {
    msgdata: [
      {
        user_id: 1,
        user_name: '周杰伦',
        mobile: '18258677890',
        ldap_name: 'zhoujielun',
        role_name: [
          '产品经理',
          '测试人员',
        ],
        status: true,
      },
      {
        user_id: 1,
        user_name: '周杰伦',
        mobile: '18258677890',
        ldap_name: 'zhoujielun',
        role_name: [
          '产品经理',
          '测试人员',
        ],
        status: false,
      },
    ],
    total: 987,
    current_page: 2,
    page_size: 10,
  },
};
export const sync = {
  code: 200,
  msg: '同步成功',
};
export const userControl = {
  code: 200,
  msg: 'xxx 启用成功',
};
export const roleList = {
  code: 200,
  msg: 'mock',
  data: {
    msgdata: [
      {
        role_id: 88,
        role_name: 'mock',
        desc: 'mock',
      },
    ],
    total: 37,
    current_page: 85,
    page_size: 21,
  },
};
export const roleDetail = {
  code: 200,
  msg: 'mock',
  data: {
    role_id: 'mock',
    role_name: 'mock',
    desc: 'mock',
  },
};
export const usersByRole = {
  code: 200,
  msg: 'mock',
  data: {
    role_id: 'mock',
    role_name: 'mock',
    user_ids: [
      {
        user_id: 18,
        user_name: 'mock',
        ldap_name: 'mock',
      },
    ],
  },
};
export default {
  list,
  sync,
  userControl,
  roleList,
  roleDetail,
  usersByRole,
};
