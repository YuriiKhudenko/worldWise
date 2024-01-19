import { Link } from "react-router-dom";
import { useCitiesContext } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { cityName, emoji, date, id, position } = city;
  const { currentCity, removeCity } = useCitiesContext();

  const isActiveClass = currentCity.id === id;

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          isActiveClass && styles["cityItem--active"]
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button
          className={styles.deleteBtn}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            removeCity(id);
          }}
        >
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
