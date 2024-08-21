import { createWithRemoteLoader } from '@kne/remote-loader';

const FormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@useFormContext']
})(({ remoteModules, groupCode, apis, isEdit, plugins = {} }) => {
  const [FormInfo, useFormContext] = remoteModules;
  const { Input, TextArea, AdvancedSelect, Select, Switch, InputNumber, RadioGroup } = FormInfo.fields;
  const { formData, openApi } = useFormContext();

  const typeList = [
    <Switch name="isList" label="是否列表" disabled={isEdit} />,
    <Switch name="isIndexed" label="是否为索引字段" display={!formData.isList} disabled={isEdit} />,
    <Select
      name="type"
      label="类型"
      rule="REQ"
      disabled={isEdit}
      options={[
        { value: 'string', label: '字符串' },
        {
          value: 'number',
          label: '数字'
        },
        { value: 'boolean', label: '布尔' },
        { value: 'date', label: '日期' },
        {
          value: 'date-range',
          label: '日期范围'
        },
        { value: 'datetime', label: '日期时间' },
        {
          value: 'datetime-range',
          label: '日期时间范围'
        },
        {
          value: 'rich-text',
          label: '富文本'
        },
        {
          value: 'file',
          label: '附件'
        },
        {
          value: 'city',
          label: '城市'
        },
        {
          value: 'industry',
          label: '行业'
        },
        {
          value: 'reference',
          label: '引用类型'
        }
      ]}
    />
  ];

  if (formData.type === 'reference' && formData.isList) {
    typeList.push(
      <RadioGroup
        name="referenceType"
        label="引用方式"
        rule="REQ"
        disabled={isEdit}
        options={[
          { value: 'inner', label: '内部引用' },
          {
            value: 'outer',
            label: '外部引用'
          }
        ]}
      />
    );
  }

  if (formData.type === 'reference') {
    typeList.push(
      <AdvancedSelect
        disabled={isEdit}
        api={Object.assign({}, apis.object.getList, {
          params: { groupCode }
        })}
        dataFormat={data => {
          return {
            list: data.map(item => {
              return { value: item.code, label: item.name };
            })
          };
        }}
        name="referenceObjectCode"
        label="引用对象"
        rule="REQ"
        single
      />
    );
  }

  if (formData.referenceObjectCode) {
    typeList.push(
      <AdvancedSelect
        disabled={isEdit}
        api={Object.assign({}, apis.field.getList, {
          params: { groupCode, objectCode: formData.referenceObjectCode }
        })}
        dataFormat={data => {
          return {
            list: data.map(item => {
              return { value: item.code, label: item.name };
            })
          };
        }}
        name="referenceFieldLabelCode"
        label="label取值字段"
        single
        value="name"
        rule="REQ"
      />
    );
  }

  if (formData.isList) {
    typeList.push(<InputNumber name="minLength" label="最小长度" />, <InputNumber name="maxLength" label="最大长度" />);
  }

  const formList = [<Input name="fieldName" label="字段名" rule="REQ" disabled={isEdit} />];
  if (formData.referenceType === 'outer' || (formData.type === 'reference' && !formData.isList)) {
    formList.push(<Input name="rule" label="验证规则" />, <Input name="formInputType" label="字段输入类型" value="AdvancedSelect" disabled />);
  }

  if (formData.type !== 'reference') {
    formList.push(
      <Input name="rule" label="验证规则" />,
      <Select
        name="formInputType"
        label="字段输入类型"
        options={Object.keys(Object.assign({}, FormInfo.fields, plugins?.fields)).map(name => ({
          value: name,
          label: name
        }))}
      />
    );
  }
  formList.push(<Switch name="isBlock" label="是否块元素" />);
  return (
    <>
      <FormInfo
        title="基本信息"
        list={[
          <Input name="name" label="名称" rule="REQ" />,
          <Input
            name="code"
            label="code"
            disabled={isEdit}
            description="缺省按照UUIDV4规则自动生成"
            onChange={e => {
              const value = e.target.value;
              openApi.setField({
                name: 'fieldName',
                value,
                runValidate: false
              });
            }}
          />,
          <TextArea name="descrition" label="描述" block />
        ]}
      />
      <FormInfo title="类型信息" list={typeList} />
      <FormInfo title="表单信息" list={formList} />
    </>
  );
});

export default FormInner;
