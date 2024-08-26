import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import transform from 'lodash/transform';
import get from 'lodash/get';
import last from 'lodash/last';
import DisplayFieldValue from './DisplayFieldValue';

const ContentView = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:InfoPage', 'components-core:Descriptions']
})(({ remoteModules, data, groupCode, objectCode, referenceContents, isInline, plugins }) => {
  const [usePreset, InfoPage, Descriptions] = remoteModules;
  const { apis } = usePreset();

  const renderObjectContent = ({ data, groupCode, objectCode }) => {
    return (
      <Fetch
        {...Object.assign({}, apis.cms.object.getMetaInfo, {
          params: { groupCode, objectCode }
        })}
        render={({ data: meta }) => {
          const { fields, object } = meta;
          const { info, single } = transform(
            fields,
            (result, field) => {
              if (field.isHidden) {
                return;
              }
              if (field.type === 'reference' && field.referenceType === 'inner') {
                if (!result['info']) {
                  result['info'] = [];
                }
                result['info'].push(field);
              } else {
                if (!result['single']) {
                  result['single'] = [];
                }
                result['single'].push(field);
              }
            },
            {}
          );
          const transformDataSource = ({ value, fields }) => {
            const dataSource = [];
            fields
              .map(field => {
                const { name, fieldName, isBlock } = field;
                return {
                  label: name,
                  content: (
                    <DisplayFieldValue
                      value={get(value, fieldName)}
                      field={field}
                      apis={apis.cms}
                      referenceContents={referenceContents}
                      isInline={isInline}
                      plugins={plugins}
                    />
                  ),
                  isBlock
                };
              })
              .forEach(target => {
                const lastItem = last(dataSource);
                const currentIndex = (lastItem && lastItem.length > 1) || target.isBlock ? dataSource.length : Math.max(0, dataSource.length - 1);
                if (!dataSource[currentIndex]) {
                  dataSource[currentIndex] = [];
                }
                dataSource[currentIndex].push(target);
              });
            return dataSource;
          };

          const renderItem = ({ data, title, index }) => {
            return (
              <InfoPage.Part key={index} title={title}>
                {single && single.length > 0 ? (
                  <InfoPage.Part>
                    <Descriptions dataSource={transformDataSource({ value: data, fields: single })} />
                  </InfoPage.Part>
                ) : null}
                {info && info.length > 0
                  ? info.map(field => {
                      return (get(data, field.fieldName) || []).map((data, index) => {
                        return (
                          <InfoPage.Part key={index} title={`${field.name}${index + 1}`}>
                            {renderObjectContent({ data, groupCode, objectCode: field.referenceObjectCode })}
                          </InfoPage.Part>
                        );
                      });
                    })
                  : null}
              </InfoPage.Part>
            );
          };

          return Array.isArray(data)
            ? data.map((data, index) =>
                renderItem({
                  data,
                  title: `${object.name}${index + 1}`,
                  index
                })
              )
            : renderItem({ data });
        }}
      />
    );
  };

  return <InfoPage>{renderObjectContent({ data, groupCode, objectCode })}</InfoPage>;
});

export default ContentView;

export { DisplayFieldValue };
