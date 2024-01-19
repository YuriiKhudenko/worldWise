import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import { useCitiesContext } from "../contexts/CitiesContext";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import BackButton from "./BackButton";
import Spinner from "./Spinner";
import Message from "./Message";

import { useUrlPosition } from "../hooks/useUrlPosition";
import { useGetCityByCoordinates } from "../hooks/useGetCityByCoordinates";

import styles from "./Form.module.css";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { mapLat, mapLng } = useUrlPosition();
  const {
    cityNameByGeo,
    emoji,
    countryByGeo,
    isCityByGeoLoading,
    setCityByGeo,
    isCityByGeoError,
  } = useGetCityByCoordinates(mapLat, mapLng);
  const { addNewCity, isLoading } = useCitiesContext();

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!cityNameByGeo || !date) return;

    const newCityData = {
      cityName: cityNameByGeo,
      country: countryByGeo,
      emoji: emoji,
      date: date,
      notes: notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
    };

    await addNewCity(newCityData);
    navigate("/app/cities");
  };

  if (isCityByGeoLoading) {
    return <Spinner />;
  }

  if (!mapLat && !mapLng) {
    return <Message message="Start by clicking somewhere on the map" />;
  }

  if (isCityByGeoError) {
    return <Message message={isCityByGeoError} />;
  }

  return (
    <form
      className={`${styles.form} ${isLoading && styles.loading}`}
      onSubmit={onSubmitHandler}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityByGeo(e.target.value)}
          value={cityNameByGeo}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityNameByGeo}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityNameByGeo}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
