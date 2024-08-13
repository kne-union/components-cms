
# Group


### 概述

对象集合


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _Group(@components/Group),lodash(lodash),_Apis(@components/Apis),remoteLoader(@kne/remote-loader)

```jsx
const { default: Group } = _Group;
const { createWithRemoteLoader } = remoteLoader;
const { getApis } = _Apis;
const {merge} =lodash;

const BaseExample = createWithRemoteLoader({
  modules: ['Global@PureGlobal', 'Global@usePreset', 'Layout']
})(({ remoteModules }) => {
  const [PureGlobal, usePreset, Layout] = remoteModules;
  const preset = usePreset();
  return <PureGlobal preset={merge({}, preset, {
    apis: {
      cms: getApis()
    }
  })}>
    <Layout navigation={{ isFixed: false }}>
      <Group />
    </Layout>
  </PureGlobal>;
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

