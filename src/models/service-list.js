import { Message } from 'antd';
import { fetchServicelist, deleteService } from '../services/service-list-api';
import { objKeyWrapper } from '../utils/utils';

const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};

export default {
  namespace: 'serviceList',
  state: {
    listInfo: {
      list: [],
      pagination: {
        current: 1,
        pageSize: PAGE_SIZE,
        total: 0,
      },
      isLoading: false,
    },
    searchFormFields: {
      serviceName: {
        value: undefined,
      },
      createTime: {
        value: undefined,
      },
    },
  },

  effects: {

    // 初始化服务列表数据
    *loadListData({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceList);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(fetchServicelist, {
        ...searchFormValues,
        ...payload,
      });
      if (response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    // 停用服务
    *deleteService({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceList);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      const response = yield call(deleteService, { ...payload });
      if (response.code === 200) {
        Message.success('停用成功');
        yield put({
          type: 'loadListData',
          payload: {
            ...searchFormValues,
            page: state.listInfo.pagination.current,
            page_size: state.listInfo.pagination.pageSize,
          },
        });
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            list: action.payload.msgdata,
          },
          ...{
            pagination: {
              current: action.payload.current_page,
              total: action.payload.total,
              pageSize: action.payload.page_size,
            },
          },
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        listInfo: {
          ...state.listInfo,
          ...{
            isLoading: action.payload,
          },
        },
      };
    },
    formFieldChange(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...action.payload,
        },
      };
    },
    reste(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...action.payload,
        },
        startTime: undefined,
        endTime: undefined,
      };
    },
  },
};
