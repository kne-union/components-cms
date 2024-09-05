import {createWithRemoteLoader} from '@kne/remote-loader';
import uniqueId from "lodash/uniqueId";
import {App} from "antd";

const ImportForm = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({remoteModules, onSuccess}) => {
  const [usePreset, FormInfo, formModule] = remoteModules;
  const {Upload} = formModule;
  const {apis, ajaxPostForm} = usePreset();
  const { message } = App.useApp();

  return (
    <FormInfo
      column={1}
      list={[
        <Upload.Field
          block
          accept={['.json']}
          showUploadList
          multiple={false}
          name="file"
          labelHidden
          label="上传文件并解析"
          rule="REQ"
          interceptor="file-format"
          uploadText="上传文件并解析"
          renderTips={defaultTips => null}
          ossUpload={async ({file}) => {
            const {data: resData} = await ajaxPostForm(apis.cms.object.parseJson.url, {file});
            if (resData.code !== 0) {
              message.error('文件解析错误');
              return;
            }
          }}
        />
      ]}
    />
  );
});

export default ImportForm;
