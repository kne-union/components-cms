const getApis = options => {
  const { prefix } = Object.assign({}, { prefix: '/api/v1/cms' }, options);

  return {
    group: {
      add: {
        url: `${prefix}/group/add`,
        method: 'POST'
      },
      copy: {
        url: `${prefix}/group/copy`,
        method: 'POST'
      },
      getList: {
        url: `${prefix}/group/getList`,
        method: 'GET'
      },
      getDetailByCode: {
        url: `${prefix}/group/getDetailByCode`,
        method: 'GET'
      },
      save: {
        url: `${prefix}/group/save`,
        method: 'POST'
      },
      close: {
        url: `${prefix}/group/close`,
        method: 'POST'
      },
      open: {
        url: `${prefix}/group/open`,
        method: 'POST'
      },
      remove: {
        url: `${prefix}/group/remove`,
        method: 'POST'
      }
    },
    object: {
      add: {
        url: `${prefix}/object/add`,
        method: 'POST'
      },
      getList: {
        url: `${prefix}/object/getList`,
        method: 'GET'
      },
      getDetailByCode: {
        url: `${prefix}/object/getDetailByCode`,
        method: 'GET'
      },
      getMetaInfo: {
        url: `${prefix}/object/getMetaInfo`,
        method: 'GET'
      },
      save: {
        url: `${prefix}/object/save`,
        method: 'POST'
      },
      remove: {
        url: `${prefix}/object/remove`,
        method: 'POST'
      },
      close: {
        url: `${prefix}/object/close`,
        method: 'POST'
      },
      open: {
        url: `${prefix}/object/open`,
        method: 'POST'
      }
    },
    field: {
      getList: {
        url: `${prefix}/field/getList`,
        method: 'GET'
      },
      add: {
        url: `${prefix}/field/add`,
        method: 'POST'
      },
      save: {
        url: `${prefix}/field/save`,
        method: 'POST'
      },
      close: {
        url: `${prefix}/field/close`,
        method: 'POST'
      },
      open: {
        url: `${prefix}/field/open`,
        method: 'POST'
      },
      remove: {
        url: `${prefix}/field/remove`,
        method: 'POST'
      },
      moveUp: {
        url: `${prefix}/field/moveUp`,
        method: 'POST'
      },
      moveDown: {
        url: `${prefix}/field/moveDown`,
        method: 'POST'
      }
    },
    content: {
      getList: {
        url: `${prefix}/content/getList`,
        method: 'GET'
      },
      getDetail: {
        url: `${prefix}/content/getDetail`,
        method: 'GET'
      },
      add: {
        url: `${prefix}/content/add`,
        method: 'POST'
      },
      save: {
        url: `${prefix}/content/save`,
        method: 'POST'
      },
      remove: {
        url: `${prefix}/content/remove`,
        method: 'POST'
      }
    }
  };
};

export default getApis;
