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
      name: 'description',
      title: '描述',
      type: 'description'
    }
  ];
};

export default getColumns;
