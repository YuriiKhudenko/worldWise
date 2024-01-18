import { useCitiesContext } from "../contexts/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";

function CountryList() {
  const { cities, isLoading } = useCitiesContext();
  //   const countriesList = Array.from(
  //     new Set(
  //       cities.map((city) =>
  //         JSON.stringify({ country: city.country, emoji: city.emoji })
  //       )
  //     ),
  //     JSON.parse
  //   );

  // const countriesList = [...new Set(cities.map((city) => city.country))];

  const countriesList = cities.reduce((countries, cityData) => {
    if (!countries.map((item) => item.country).includes(cityData.country)) {
      return [
        ...countries,
        { country: cityData.country, emoji: cityData.emoji },
      ];
    }

    return countries;
  }, []);

  console.log("countriesList ", countriesList);
  return (
    <div className={styles.countryList}>
      {countriesList.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </div>
  );
}

export default CountryList;
