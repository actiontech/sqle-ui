import i18n from '../../../../locale';

const getWeekLocales = () => {
  return [
    i18n.t('周一'),
    i18n.t('周二'),
    i18n.t('周三'),
    i18n.t('周四'),
    i18n.t('周五'),
    i18n.t('周六'),
    i18n.t('周日'),
  ];
};
export const lineData = getWeekLocales().map((w, i) => {
  return {
    date: w,
    value: (i + 1) * 10,
  };
});

export const pieData = [
  {
    instance_type: 'Mysql',
    percent: 27,
  },
  {
    instance_type: 'Oracle',
    percent: 25,
  },
  {
    instance_type: 'Redis',
    percent: 18,
  },
  {
    instance_type: 'MongoDB',
    percent: 15,
  },
  {
    instance_type: 'TiDB',
    percent: 5,
  },
];

export const radialBarData = [
  {
    type: 'test1',
    percent: 0.1,
  },
  {
    type: 'test2',
    percent: 0.4,
  },
  {
    type: 'test3',
    percent: 1.1,
  },
];
