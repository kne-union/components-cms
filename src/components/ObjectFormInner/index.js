import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';

const ObjectFormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, objectCode, groupCode, apis, plugins = {}, ...props }) => {
  const [FormInfo] = remoteModules;
  const { List, MultiField } = FormInfo;

  const renderItem = ({ fieldName, name, isList, minLength, maxLength, isBlock, rule, type, reference, referenceObject, formInputType }) => {
    if (isList && type === 'reference' && reference?.type === 'inner') {
      return (
        <Fetch
          {...Object.assign({}, apis.field.getList, {
            params: { objectCode: referenceObject.code, groupCode: referenceObject.groupCode, status: 0 }
          })}
          block
          render={({ data }) => {
            if (!(Array.isArray(data) && data.length > 0)) {
              return null;
            }
            return <List title={name} name={fieldName} maxLength={maxLength} minLength={minLength} list={data.map(renderItem)} />;
          }}
        />
      );
    }

    const formFieldProps = {};
    const Component = Object.assign({}, FormInfo.fields, plugins?.fields)[formInputType] || FormInfo.fields.Input;

    if (type === 'reference' && reference?.type === 'outer') {
      formFieldProps.api = Object.assign({}, apis.content.getList, {
        params: {
          groupCode: reference.groupCode,
          objectCode: reference.targetObjectCode
        },
        transformData: data => {
          return Object.assign({}, data, {
            pageData: data.pageData.map(item => {
              return {
                value: item.id,
                label: item[reference.targetObjectFieldLabelCode || 'name']
              };
            })
          });
        }
      });
    }

    if (!isList && formInputType === 'AdvancedSelect') {
      formFieldProps.single = true;
    }

    if (isList && type !== 'reference') {
      return <MultiField name={fieldName} label={name} rule={rule} block field={Component} />;
    }
    return <Component name={fieldName} label={name} rule={rule} block={isBlock} {...formFieldProps} />;
  };

  return (
    <Fetch
      {...Object.assign({}, apis.field.getList, {
        params: { objectCode, groupCode, status: 0 }
      })}
      render={({ data }) => {
        return <FormInfo {...props} list={data.map(renderItem)} />;
      }}
    />
  );
});

export default ObjectFormInner;
