import RemoteLoader from '@kne/remote-loader';
import ContentView from '@components/ContentView';
import { useCurrentTypes } from '@components/Field';
import get from 'lodash/get';
import Fetch from '@kne/react-fetch';
import isNil from 'lodash/isNil';

const DisplayFieldValue = ({ value, field, apis, referenceContents, isInline, plugins }) => {
  const currentTypes = useCurrentTypes(plugins?.types);
  const format = ({ value, field }) => {
    if (isNil(value)) {
      return value;
    }
    if (field.type === 'reference' && field.referenceType === 'outer') {
      const target = referenceContents[field.code] && referenceContents[field.code].find(item => item.id === value);

      if (target) {
        return format({ value: get(target, field.referenceFieldLabelCode), field: field.referenceFieldLabel });
      }
      return (
        <Fetch
          {...Object.assign({}, apis.content.getDetail, {
            params: { id: value }
          })}
          render={({ data: target }) => {
            const displayField = target.fields.find(item => item.code === field.referenceFieldLabelCode);
            return format({ value: get(target.data, displayField.code), field: displayField });
          }}
        />
      );
    }
    const targetType = currentTypes.get(field.type);
    if (targetType && targetType.render) {
      return targetType.render({ value, isInline, field });
    }
    if (field.type === 'industry') {
      return <RemoteLoader module="components-core:Common@IndustryEnum" name={value} />;
    }
    if (field.type === 'boolean') {
      return value ? '是' : '否';
    }
    if (field.type === 'file') {
      return Array.isArray(value) ? (
        value.map(file => (
          <RemoteLoader module="components-core:File@FileLink" {...file} type="link" originName={file.filename}>
            查看
          </RemoteLoader>
        ))
      ) : (
        <RemoteLoader module="components-core:File@FileLink" {...value} type="link" originName={value.filename}>
          查看
        </RemoteLoader>
      );
    }
    return value;
  };

  if (field.type === 'reference' && field.reference.type === 'inner') {
    return (
      <RemoteLoader
        module="components-core:Modal@ModalButton"
        type="link"
        modalProps={{
          title: field.name,
          children: (
            <ContentView
              data={value}
              groupCode={field.groupCode}
              objectCode={field.referenceObjectCode}
              plugins={plugins}
              referenceContents={referenceContents}
            />
          )
        }}
      >
        查看
      </RemoteLoader>
    );
  }

  if (field.isList) {
    return (value || []).map(value => format({ value, field })).join(',');
  }

  return format({ value, field });
};

export default DisplayFieldValue;
