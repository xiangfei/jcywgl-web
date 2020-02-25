import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { table, add, info } from './mock/project-list';
import { list, sync, userControl, roleList, roleDetail, usersByRole} from './mock/user-manage';
import { login, logout} from './mock/login';
import { format, delay } from 'roadhog-api-doc';
import { orgTree } from './mock/orgTree';
import { serviceList, serviceInfo, serviceAdd, dataDictionary, deleteService } from './mock/service-list';

const common = {
  code: 200,
  msg: '成功'
}
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
// const noProxy = true;

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/eHBsAsOrrJcnvFlnzNTT.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName } = req.body;
    res.send({ status: password === '888888' && userName === 'admin' ? 'ok' : 'error', type: 'account' });
  },
  'POST /api/login/mobile': (req, res) => {
    res.send({ status: 'ok', type: 'mobile' });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok' });
  },
  // 之前是模板实例代码，下面是业务代码

  // 项目列表
  'POST /project/list': table,
  'POST /project/add': add,
  'POST /project/update': add,
  'POST /project/info': info,
  
  // 用户管理
  'POST /account/user/search': list,
  'POST /account/user/sync': sync,
  'POST /account/role/search': roleList,
  'POST /account/role/add': common,
  'POST /account/role/edit': common,
  'POST /account/role/delete': common,
  'POST /account/role/roleinfo': roleDetail,
  'POST /account/role/authorinfos': common,
  'POST /account/role/authoredit': common,
  'POST /account/role/userinfos': usersByRole,
  'POST /account/role/usersedit': common,
  
  // 组织树
  'POST /account/user/organizetree': orgTree,
  'POST /account/user/setstatus': userControl,
  
  // 登录，登出
  'POST /account/user/login': login, 
  'POST /account/user/logout': logout, 

  // 服务列表
  'POST /module/list': serviceList,

  //服务详情
  'POST /module/info': serviceInfo,
  'POST /module/add': serviceAdd,
  'POST /module/update': serviceAdd,
  'GET /account/user/data_dictionary': dataDictionary,
  'POST /module/delete': deleteService,
};

export default noProxy ? {} : delay(proxy, 1000);
