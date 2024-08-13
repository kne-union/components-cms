const { default: Group } = _Group;
const { createWithRemoteLoader } = remoteLoader;
const { getApis } = _Apis;
const { merge } = lodash;

const BaseExample = createWithRemoteLoader({
  modules: ['Global@PureGlobal', 'Global@usePreset', 'Layout']
})(({ remoteModules }) => {
  const [PureGlobal, usePreset, Layout] = remoteModules;
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
        <Group />
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);
