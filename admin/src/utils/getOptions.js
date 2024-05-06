import vnCities from '../contents/vn.json';
import jpCities from '../contents/jp.json';

export const getCountryOptions = () => {
  return [
    { key: 'Japan', value: 'Japan' },
    { key: 'Vietnam', value: 'Vietnam' },
  ];
};

export const getPrefectureOptions = (country) => {
  let rawLocations = [];

  if (country === 'Vietnam') {
    rawLocations = vnCities;
  }

  if (country === 'Japan') {
    rawLocations = jpCities;
  }

  return rawLocations.reduce((acc, item) => {
    if (acc.some((prefecture) => prefecture.value === item.admin_name)) {
      return acc;
    }

    return [...acc, { key: item.admin_name, value: item.admin_name }];
  }, []);
};

export const getCityOptions = (country, prefecture) => {
  const rawLocations = country === 'Vietnam' ? vnCities : jpCities;

  return rawLocations
    .filter((item) => item.admin_name === prefecture)
    .map((item) => ({ key: item.city, value: item.city }));
};
