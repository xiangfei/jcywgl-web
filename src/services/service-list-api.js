import { stringify } from 'qs';
import request from '../utils/request';

// 服务列表lsit查询
export async function fetchServicelist(params) {
  return request('/module/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 服务详情
export async function serviceInfoList(params) {
  return request('/module/info', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 新增服务
export async function addService(params) {
  return request('/module/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新服务
export async function updateService(params) {
  return request('/module/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 数据字典
export async function fetchDataDictionary(params) {
  return request('/account/user/data_dictionary', {
    method: 'GET',
  });
}

// 停用服务
export async function deleteService(params) {
  return request('/module/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
