const { default: Cms } = _Cms;
const { createWithRemoteLoader } = remoteLoader;
const { getApis } = _Apis;
const { merge } = lodash;
const { Routes, Route, Navigate } = reactRouter;

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
        <Routes>
          <Route
            path="/Cms/*"
            element={
              <Cms
                baseUrl="/Cms"
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
            }
          />
          <Route path="*" element={<Navigate to="/Cms" />} />
        </Routes>
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);
