const getApis = options => {
  const { prefix } = Object.assign({}, { prefix: '/api/v1/cms' }, options);

  return {
    group: {
      add: {
        url: `${prefix}/group/add`,
        method: 'POST'
      },
      getList: {
        url: `${prefix}/group/getList`,
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
    }
  };
};

export default getApis;
