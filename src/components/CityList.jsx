import { useCitiesContext } from "../contexts/CitiesContext";

import Spinner from "../components/Spinner";
import CityItem from "./CityItem";
import Message from "./Message";

import styles from "./CityList.module.css";

function CityList() {
  const { cities, isLoading, error } = useCitiesContext();

  if (error) {
    alert(
      "Please use github to download and install the project, see readme.md 😉"
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!cities.length) {
    return (
      <Message message="Add your fist city by clicking on the city on the map" />
    );
  }

  return (
    <div className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </div>
  );
}

export default CityList;
