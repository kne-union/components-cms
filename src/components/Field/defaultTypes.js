const defaultTypes = new Map([
  [
    'string',
    {
      fields: ['Input', 'Password', 'TextArea', 'InputUpperCase'],
      label: '字符串'
    }
  ],
  [
    'number',
    {
      fields: ['InputNumber', 'Rate', 'Slider'],
      label: '数字'
    }
  ],
  [
    'boolean',
    {
      fields: [
        'Switch',
        {
          field: 'RadioGroup',
          props: {
            options: [
              { value: true, label: '是' },
              { value: false, label: '否' }
            ]
          }
        }
      ],
      label: '布尔'
    }
  ],
  [
    'date',
    {
      fields: [
        {
          field: 'DatePicker',
          props: {
            interceptor: 'date-string'
          }
        }
      ],
      label: '日期'
    }
  ],
  [
    'datetime',
    {
      fields: [
        {
          field: 'DatePicker',
          props: {
            showTime: true,
            interceptor: 'date-string'
          }
        }
      ],
      label: '日期时间'
    }
  ],
  [
    'date-range',
    {
      fields: [
        {
          field: 'DatePickerRange',
          props: {
            interceptor: 'date-range-string'
          }
        }
      ],
      label: '日期范围'
    }
  ],
  [
    'datetime-range',
    {
      fields: [
        {
          field: 'DatePickerRange',
          props: {
            showTime: true,
            interceptor: 'date-range-string'
          }
        }
      ],
      label: '日期时间范围'
    }
  ],
  [
    'phone',
    {
      fields: [
        {
          field: 'PhoneNumber',
          props: {
            interceptor: 'phone-number-string'
          }
        }
      ],
      label: '电话'
    }
  ],
  [
    'city',
    {
      fields: [
        {
          field: 'AddressSelect',
          acceptList: true
        }
      ],
      label: '城市'
    }
  ],
  [
    'industry',
    {
      fields: [
        {
          field: 'IndustrySelect',
          acceptList: true
        }
      ],
      label: '行业'
    }
  ],
  [
    'file',
    {
      fields: [
        {
          field: 'Avatar',
          props: {
            interceptor: 'file-format'
          }
        },
        {
          field: 'Upload',
          acceptList: true,
          props: {
            interceptor: 'file-format'
          }
        }
      ],
      label: '附件'
    }
  ],
  [
    'reference',
    {
      fields: [
        {
          field: 'AdvancedSelect',
          acceptList: true,
          props: ({ apis, field }) => {
            const { reference } = field;
            return {
              api: Object.assign({}, apis.content.getList, {
                params: {
                  groupCode: reference.groupCode,
                  objectCode: reference.targetObjectCode
                },
                transformData: data => {
                  return Object.assign({}, data, {
                    pageData: data.pageData.map(item => {
                      return {
                        value: item.id,
                        label: item[field.referenceFieldLabelCode]
                      };
                    })
                  });
                }
              })
            };
          }
        }
      ],
      label: '引用类型'
    }
  ]
]);

export default defaultTypes;
