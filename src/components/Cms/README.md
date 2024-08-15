
# Cms


### 概述

内容管理


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _Cms(@components/Cms),reactRouter(react-router-dom),lodash(lodash),_Apis(@components/Apis),remoteLoader(@kne/remote-loader)

```jsx
const { default: Cms } = _Cms;
const { createWithRemoteLoader } = remoteLoader;
const { getApis } = _Apis;
const { merge } = lodash;
const { Routes, Route, Navigate } = reactRouter;

const BaseExample = createWithRemoteLoader({
  modules: ['Global@PureGlobal', 'Global@usePreset', 'Layout']
})(({ remoteModules }) => {
  const [PureGlobal, usePreset, Layout] = remoteModules;
  const preset = usePreset();
  return (<PureGlobal
    preset={merge({}, preset, {
      apis: {
        cms: getApis()
      }
    })}
  >
    <Layout navigation={{ isFixed: false }}>
      <Routes>
        <Route path="/Cms/*" element={<Cms baseUrl="/Cms" />} />
        <Route path="*" element={<Navigate to="/Cms" />} />
      </Routes>
    </Layout>
  </PureGlobal>);
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

