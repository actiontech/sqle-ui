import {
  turnCommonToDataSourceParams,
  turnDataSourceAsyncFormToCommon,
} from '.';

describe('datasource tool', () => {
  it('should turn data source async params to common', () => {
    expect(
      turnDataSourceAsyncFormToCommon([
        {
          description: '234',
          name: '124',
          type: 'int',
          value: '123',
        },
      ])
    ).toEqual([
      {
        desc: '234',
        key: '124',
        type: 'int',
        value: '123',
      },
    ]);
  });

  it('should turn async form value to data source params', () => {
    expect(
      turnCommonToDataSourceParams([
        {
          key: '124',
          value: '123',
        },
      ])
    ).toEqual([
      {
        name: '124',
        value: '123',
      },
    ]);
  });
});
