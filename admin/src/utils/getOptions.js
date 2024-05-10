import prefectures from '../contents/prefectures.json';

const municipalities = prefectures.reduce((accumulator, cur) => {
  return [...accumulator, ...cur.municipalities];
}, []);

export const getPrefectureOptions = () => {
  return prefectures;
};

export const getMunicipalities = () => {
  return municipalities;
};
