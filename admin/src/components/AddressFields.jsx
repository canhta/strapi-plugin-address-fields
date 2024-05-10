import { Box, Flex } from '@strapi/design-system';
import { Combobox, Field, FieldLabel, TextInput } from '@strapi/design-system';
import { ComboboxOption } from '@strapi/design-system';
import { useMemo, useState } from 'react';

import { getMunicipalities, getPrefectureOptions } from '../utils/getOptions';

const prefectures = getPrefectureOptions();
const municipalities = getMunicipalities();
const regex = /\d+;\d+;[a-zA-Z0-9-〒]*/gm;
const delim = ';';

export default function AddressFields({ onChange, labelAction, value, name, attribute, error, required = false }) {
  const t = {
    'form.prefecture.label': '都道府県',
    'form.prefecture.placeholder': '都道府県を選択',
    'form.municipality.label': '都会',
    'form.municipality.placeholder': '都会を選択',
    'form.error.empty': '',
    'form.postCode.label': '郵便番号',
    'form.postCode.placeholder': '郵便番号を入力',
  };

  const safeValue = useMemo(() => {
    const [prefectureId, id, postCode] = value && regex.test(value) ? value.split(delim) : ['0', '0', ''];
    return {
      prefectureId: parseInt(prefectureId),
      id: parseInt(id),
      postCode: postCode,
    };
  }, [value]);

  const [currentValue, setCurrentValue] = useState(safeValue);
  const possibleMunicipalities = municipalities.filter((it) => it.prefectureId === currentValue?.prefectureId);

  const localOnChange = (level) => (value) => {
    const id = isNaN(parseInt(value)) ? 0 : parseInt(value);

    if (level === 'prefecture') {
      setCurrentValue({
        ...currentValue,
        id: undefined,
        prefectureId: id,
      });
    } else if (level === 'municipality') {
      setCurrentValue({
        ...currentValue,
        id: id,
      });
      onChange({
        target: {
          name,
          value: [currentValue?.prefectureId, id, currentValue?.postCode].join(delim),
          type: attribute.type,
        },
      });
    } else if (level === 'postCode') {
      setCurrentValue({
        ...currentValue,
        postCode: value,
      });
      const tokens = [currentValue?.prefectureId, currentValue?.id, value];
      const updatedValue = tokens.some((it) => !!it) ? undefined : tokens.join(delim);

      onChange({
        target: {
          name,
          value: updatedValue,
          type: attribute.type,
        },
      });
    }
  };

  const localOnClear = (level) => () => {
    if (level === 'prefecture') {
      setCurrentValue({
        ...currentValue,
        id: undefined,
        prefectureId: undefined,
      });
    } else if (level === 'municipality') {
      setCurrentValue((value) => ({
        ...currentValue,
        id: undefined,
        prefectureId: value?.prefectureId,
      }));
    }
  };

  return (
    <Field
      name={name}
      id={name}
      error={municipalities.find((it) => it.prefectureId === currentValue?.prefectureId && it.id === currentValue?.id)}
      required={required}
      col={12}
    >
      <Flex gap={4} direction="column" alignItems="stretch" col={12}>
        <Box>
          <FieldLabel action={labelAction}>{name}</FieldLabel>
        </Box>

        <Flex gap={6} justifyContent="between" col={12}>
          <Box grow={1}>
            <TextInput
              required={required}
              onChange={(event) => localOnChange('postCode')(event.target.value)}
              placeholder={t['form.postCode.placeholder']}
              label={t['form.postCode.label']}
              value={currentValue?.postCode}
              name="postCode"
            ></TextInput>
          </Box>
          <Box grow={1}>
            <Combobox
              label={t['form.prefecture.label']}
              name="prefecture"
              error={error}
              required={required}
              placeholder={t['form.prefecture.placeholder']}
              value={currentValue?.prefectureId}
              onChange={localOnChange('prefecture')}
              onClear={localOnClear('prefecture')}
            >
              {prefectures.map((item) => (
                <ComboboxOption key={item.name_jp} value={item.id}>
                  {item.name_jp}
                </ComboboxOption>
              ))}
            </Combobox>
          </Box>
          <Box grow={1}>
            <Combobox
              label={t['form.municipality.label']}
              name="municipality"
              error={error}
              required={required}
              placeholder={t['form.municipality.placeholder']}
              value={currentValue?.id}
              disabled={possibleMunicipalities.length === 0}
              onChange={localOnChange('municipality')}
              onClear={localOnClear('municipality')}
            >
              {possibleMunicipalities.map((item) => (
                <ComboboxOption key={item.name_jp} value={item.id}>
                  {item.name_jp}
                </ComboboxOption>
              ))}
            </Combobox>
          </Box>
        </Flex>
      </Flex>
    </Field>
  );
}
