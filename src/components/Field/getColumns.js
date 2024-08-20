const getColumns = ({ navigateTo }) => {
  return [
    {
      name: 'name',
      title: '名称',
      type: 'other'
    },
    {
      name: 'code',
      title: 'code',
      type: 'other'
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
      name: 'type',
      title: '类型',
      type: 'other'
    },
    {
      name: 'referenceObject.name',
      title: '引用对象',
      hover: true,
      primary: true,
      type: 'other',
      onClick: ({ colItem }) => navigateTo(colItem)
    },
    {
      name: 'isList',
      title: '是否列表',
      type: 'other',
      valueOf: (item, { name }) => {
        return item[name] ? '是' : '否';
      }
    },
    {
      name: 'isIndexed',
      title: '是否索引',
      type: 'other',
      valueOf: (item, { name }) => {
        return item[name] ? '是' : '否';
      }
    },
    {
      name: 'formInputType',
      title: '输入组件',
      type: 'other'
    },
    {
      name: 'description',
      title: '描述',
      type: 'description'
    }
  ];
};

export default getColumns;
