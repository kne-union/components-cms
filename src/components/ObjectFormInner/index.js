import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { useCurrentTypes } from '@components/Field';

const ObjectFormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, objectCode, groupCode, apis, plugins = {}, ...props }) => {
  const [FormInfo] = remoteModules;
  const { List, MultiField } = FormInfo;
  const currentTypes = useCurrentTypes(plugins?.types);
  const renderItem = field => {
    const { fieldName, name, isList, minLength, maxLength, isBlock, isHidden, rule, type, reference, referenceObject, formInputType } = field;
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
    const currentType = currentTypes.get(type);
    const fieldInput = (() => {
      const target = currentType.fields
        .map(item => {
          if (typeof item === 'string') {
            return { field: item, props: {} };
          }
          return item;
        })
        .find(item => item.field === formInputType);
      return target || { field: 'Input', props: {} };
    })();

    const formFieldProps = (() => {
      return Object.assign(
        {},
        typeof fieldInput.props === 'function'
          ? fieldInput.props({
              field,
              apis
            })
          : fieldInput.props,
        fieldInput.acceptList
          ? {
              single: !isList
            }
          : {}
      );
    })();
    const Component = Object.assign({}, FormInfo.fields, plugins?.fields)[fieldInput.field];

    if (isList && !fieldInput.acceptList) {
      return <MultiField name={fieldName} label={name} rule={rule} block display={!isHidden} field={Component} />;
    }
    return <Component name={fieldName} label={name} rule={rule} block={isBlock} display={!isHidden} {...formFieldProps} />;
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
