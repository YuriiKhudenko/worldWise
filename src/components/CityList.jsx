import styles from "./CityList.module.css";
import Spinner from "../components/Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCitiesContext } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCitiesContext();
  console.log("CityList cities ", cities);

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
