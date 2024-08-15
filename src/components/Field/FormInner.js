import { createWithRemoteLoader } from '@kne/remote-loader';

const FormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, isEdit }) => {
  const [FormInfo] = remoteModules;
  const { Input, TextArea, AdvancedSelect, Switch } = FormInfo.fields;
  const { useFormContext } = FormInfo;
  return (
    <>
      <FormInfo
        title="基本信息"
        list={[
          <Input name="name" label="名称" rule="REQ" />,
          <Input name="code" label="code" disabled={isEdit} description="缺省按照UUIDV4规则自动生成" />,
          <TextArea name="descrition" label="描述" />,
          <Switch name="isIndexed" label="是否为索引字段" />
        ]}
      />
      <FormInfo title="类型信息" list={[<Switch name="isReference" label="是否为引用类型" />]} />
      <FormInfo
        title="表单信息"
        list={[
          <Input name="fieldName" label="字段名" rule="REQ" />,
          <Input name="rule" label="验证规则" />,
          <AdvancedSelect
            name="formInputType"
            label="字段输入类型"
            loader={() => {
              return [];
            }}
          />
        ]}
      />
    </>
  );
});

export default FormInner;
