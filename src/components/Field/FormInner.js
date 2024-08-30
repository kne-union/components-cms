import { createWithRemoteLoader } from '@kne/remote-loader';
import useCurrentTypes from './useCurrentTypes';

const FormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@useFormContext']
})(({ remoteModules, groupCode, apis, isEdit, plugins = {} }) => {
  const [FormInfo, useFormContext] = remoteModules;
  const { Input, TextArea, AdvancedSelect, Select, Switch, InputNumber, RadioGroup } = FormInfo.fields;
  const { formData, openApi } = useFormContext();

  const currentTypes = useCurrentTypes(plugins?.types);

  const typeList = [
    <Select
      name="type"
      label="类型"
      rule="REQ"
      disabled={isEdit}
      options={Array.from(currentTypes).map(([name, { label }]) => {
        return { value: name, label };
      })}
    />
  ];

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
      />,
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

  if (formData.referenceType === 'outer' && formData.referenceObjectCode) {
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
  typeList.push(<Switch name="isList" label="是否列表" disabled={isEdit} />);
  if (formData.isList) {
    typeList.push(<InputNumber name="minLength" label="最小长度" />, <InputNumber name="maxLength" label="最大长度" />);
  }
  if (formData.referenceType !== 'inner' && formData.type !== 'secret') {
    typeList.push(<Switch name="isIndexed" label="是否为索引字段" disabled={isEdit} />);
  }

  const referenceSelect = (
    <Select
      name="formInputType"
      label="字段输入类型"
      rule="REQ"
      options={(currentTypes.get(formData.type)?.fields || []).map(item => {
        if (typeof item === 'string') {
          return { value: item, label: item };
        }

        return { value: item.field, label: item.field };
      })}
    />
  );

  const formList = [<Input name="fieldName" label="字段名" rule="REQ" disabled={isEdit} />];
  if (formData.referenceType !== 'inner') {
    formList.push(<Input name="rule" label="验证规则" />, referenceSelect);
  }
  if (formData.referenceType === 'inner' && formData.isList) {
    formList.push(
      <Select
        name="formInputType"
        label="列表类型"
        rule="REQ"
        options={[
          { value: 'List', label: 'List' },
          { value: 'TableList', label: 'TableList' }
        ]}
      />
    );
  }
  formList.push(<Switch name="isBlock" label="是否块元素" />);
  formList.push(<Switch name="isHidden" label="是否隐藏元素" />);
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
