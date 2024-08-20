import { createWithRemoteLoader } from '@kne/remote-loader';

const FormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, isEdit }) => {
  const [FormInfo] = remoteModules;
  const { Input, TextArea } = FormInfo.fields;
  return (
    <FormInfo
      column={1}
      list={[
        <Input name="name" label="名称" rule="REQ" />,
        <Input name="code" label="code" disabled={isEdit} description="缺省按照UUIDV4规则自动生成" />,
        <TextArea name="descrition" label="描述" />
      ]}
    />
  );
});

export default FormInner;
