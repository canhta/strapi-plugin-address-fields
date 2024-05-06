import { Box, Flex } from '@strapi/design-system';
import { Combobox } from '@strapi/design-system';
import { ComboboxOption } from '@strapi/design-system';
import { getCityOptions, getCountryOptions, getPrefectureOptions } from '../utils/getOptions';
import { useEffect, useState } from 'react';

const countryOptions = getCountryOptions();

export default function AddressFields({
  onChange,
  value,
  name,
  attribute,
  error,
  required = false,
  disabled = false,
}) {
  const [selectedValue, setSelectedValue] = useState(
    value && typeof value === 'string' ? JSON.parse(value) : {}
  );
  const [prefectureOptions, setPrefectureOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (selectedValue?.country) {
      setPrefectureOptions(getPrefectureOptions(selectedValue?.country));
    } else {
      setPrefectureOptions([]);
    }
  }, [selectedValue?.country]);

  useEffect(() => {
    if (selectedValue?.prefecture && selectedValue?.country) {
      setCityOptions(getCityOptions(selectedValue?.country, selectedValue?.prefecture));
    } else {
      setCityOptions([]);
    }
  }, [selectedValue?.prefecture, selectedValue?.country]);

  useEffect(() => {
    if (selectedValue) {
      onChange({
        target: {
          name,
          value: JSON.stringify(selectedValue),
          type: attribute.type,
        },
      });
    }
  }, [onChange, selectedValue, name, attribute.type]);

  const handleOnChange = (name) => (value) => {
    if (name === 'country') {
      setSelectedValue({
        country: value,
        prefecture: undefined,
        city: undefined,
      });
    }

    if (name === 'prefecture') {
      setSelectedValue({
        ...selectedValue,
        prefecture: value,
        city: undefined,
      });
    }

    if (name === 'city') {
      setSelectedValue({
        ...selectedValue,
        city: value,
      });
    }
  };

  const handleOnClear = (name) => () => {
    if (name === 'country') {
      setSelectedValue({
        country: undefined,
        prefecture: undefined,
        city: undefined,
      });
    }

    if (name === 'prefecture') {
      setSelectedValue({
        ...selectedValue,
        prefecture: undefined,
        city: undefined,
      });
    }

    if (name === 'city') {
      setSelectedValue({
        ...selectedValue,
        city: undefined,
      });
    }
  };

  return (
    <Flex gap={6}>
      <Box>
        <Combobox
          label="Country"
          name="country"
          error={error}
          required={required}
          placeholder="Select country"
          value={selectedValue?.country}
          disabled={disabled}
          onChange={handleOnChange('country')}
          onClear={handleOnClear('country')}
        >
          {countryOptions.map((item) => (
            <ComboboxOption key={item.key} value={item.value}>
              {item.value}
            </ComboboxOption>
          ))}
        </Combobox>
      </Box>
      <Box>
        <Combobox
          label="Prefecture"
          name="prefecture"
          error={error}
          required={required}
          placeholder="Select prefecture"
          value={selectedValue?.prefecture}
          disabled={prefectureOptions.length === 0}
          onChange={handleOnChange('prefecture')}
          onClear={handleOnClear('prefecture')}
        >
          {prefectureOptions.map((item) => (
            <ComboboxOption key={item.key} value={item.value}>
              {item.value}
            </ComboboxOption>
          ))}
        </Combobox>
      </Box>
      <Box>
        <Combobox
          label="City"
          name="city"
          error={error}
          required={required}
          placeholder="Select city"
          value={selectedValue?.city}
          disabled={cityOptions.length === 0}
          onChange={handleOnChange('city')}
          onClear={handleOnClear('city')}
        >
          {cityOptions.map((item) => (
            <ComboboxOption key={item.key} value={item.value}>
              {item.value}
            </ComboboxOption>
          ))}
        </Combobox>
      </Box>
    </Flex>
  );
}
