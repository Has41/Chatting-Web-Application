declare module "react-select-country-list" {
  const countryList: () => {
    getData: () => Array<{ value: string; label: string }>
  }

  export default countryList
}
