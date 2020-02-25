import { Message } from 'antd';
import { addService, updateService, fetchDataDictionary } from '../services/service-list-api';
import { objKeyWrapper } from '../utils/utils';


const PAGE_SIZE = 20;
const getValuesFromFields = (obj) => {
  return obj.value;
};

export default {
  namespace: 'serviceAdd',
  state: {
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
    dataDictionary: {},
  },

  effects: {
    *serviceAdd({ payload }, { call, put, select }) {
      const state = yield select(store => store.serviceAdd);
      const searchFormValues = objKeyWrapper(state.searchFormFields, getValuesFromFields);
      yield put({
        type: 'serviceInfo/changeLoading',
        payload: true,
      });
      let response = null;
      if (payload.type == 'edit') {
        response = yield call(updateService, {
          ...searchFormValues,
          id: payload.id,
        });
      } else {
        response = yield call(addService, {
          ...searchFormValues,
        });
      }

      if (response.code === 200) {
        Message.success('保存成功');
      }
      yield put({
        type: 'serviceInfo/changeLoading',
        payload: false,
      });
      // 增加编辑之后重新查询table表格数据， 并且初始化搜索条件
      yield put({
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
      yield put({
        type: 'serviceList/loadListData',
      });
    },
    *resetFiledsValue({ payload }, { put }) {
      yield put({
        type: 'serviceInfo/reste',
      });
      yield put({
        type: 'reset',
        payload,
      });
    },

    *fetchDataDictionary({ payload }, { call, put }) {
      const response = yield call(fetchDataDictionary);
      if (response.code === 200) {
        yield put({
          type: 'saveDataDictionary',
          payload: response.data,
        });
      }
    },
  },
  reducers: {
    formFieldChange(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...state.searchFormFields,
          ...action.payload,
        },
      };
    },
    saveDataDictionary(state, action) {
      return {
        ...state,
        dataDictionary: {
          ...action.payload,
        },
      };
    },
    setFormValue(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...{ module_tech: {
            value: action.payload.module_tech,
          },
          },
          ...{ module_name: {
            value: action.payload.module_name,
          },
          },
          ...{ module_path: {
            value: action.payload.module_path,
          },
          },
          ...{ logs_path: {
            value: action.payload.logs_path,
          },
          },
          ...{ port: {
            value: action.payload.port,
          },
          },
          ...{ module_type: {
            value: action.payload.module_type,
          },
          },
          ...{ publicservice: {
            value: action.payload.publicservice ? 1 : 2,
          },
          },
          ...{ desc: {
            value: action.payload.desc,
          },
          },
        },
      };
    },
    reset(state, action) {
      return {
        ...state,
        searchFormFields: {
          ...action.payload,
        },
      };
    },
  },
};
