import { createWithRemoteLoader } from '@kne/remote-loader';

const FormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({ remoteModules, isEdit, isCopy }) => {
  const [FormInfo, formModule] = remoteModules;
  const { Input, TextArea } = FormInfo.fields;
  const { Switch } = formModule;
  return (
    <FormInfo
      column={1}
      list={[
        <Switch display={!!isCopy} name="withContent" label="是否复制对象集合数据内容" />,
        <Input name="name" label="名称" rule="REQ" />,
        <Input name="code" label="code" disabled={isEdit} description="缺省按照UUIDV4规则自动生成" />,
        <TextArea name="descrition" label="描述" />
      ]}
    />
  );
});

export default FormInner;
