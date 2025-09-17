declare module "react-select-country-list" {
  interface CountryOption {
    value: string;
    label: string;
  }

  export default function countryList(): {
    getData: () => CountryOption[];
    getValue: (label: string) => string;
    getLabel: (value: string) => string;
  };
}