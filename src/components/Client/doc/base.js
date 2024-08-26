const { default: Client } = _Client;
const { createWithRemoteLoader } = remoteLoader;
const { getApis } = _Apis;
const { merge } = lodash;

const BaseExample = createWithRemoteLoader({
  modules: ['Global@PureGlobal', 'Global@usePreset', 'Layout', 'components-ckeditor:Editor']
})(({ remoteModules }) => {
  const [PureGlobal, usePreset, Layout, Editor] = remoteModules;
  const preset = usePreset();
  return (
    <PureGlobal
      preset={merge({}, preset, {
        apis: {
          cms: getApis()
        }
      })}
    >
      <Layout navigation={{ isFixed: false }}>
        <Client
          groupCode="homepage"
          menuFixed={false}
          plugins={{
            types: [
              [
                'rich-text',
                {
                  fields: ['CKEditor'],
                  label: '富文本'
                }
              ]
            ],
            renders: {
              'rich-text': ({ value, isInline }) => {
                if (isInline) {
                  return (value || '').replace(/<[^>]+>/g, '');
                }
                return <Editor.Content value={value} />;
              }
            },
            fields: {
              CKEditor: Editor
            }
          }}
        />
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);
