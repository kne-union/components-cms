const getColumns = ({ navigateTo }) => {
  return [
    {
      name: 'name',
      title: '名称',
      type: 'mainInfo',
      onClick: ({ colItem }) => navigateTo(colItem)
    },
    {
      name: 'code',
      title: 'code',
      type: 'mainInfo',
      onClick: ({ colItem }) => navigateTo(colItem)
    },
    {
      name: 'status',
      title: '状态',
      type: 'tag',
      valueOf: (item, { name }) => {
        if (item[name] === 0) {
          return { type: 'success', text: '正常' };
        }
        if (item[name] === 10) {
          return { type: 'danger', text: '已关闭' };
        }
        return { text: '其他' };
      }
    },
    {
      name: 'description',
      title: '描述',
      type: 'description'
    }
  ];
};

export default getColumns;
