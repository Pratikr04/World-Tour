// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import { useURLPosition } from "../hooks/useURL";

import styles from "./Form.module.css";
import Buttons from "./Buttons";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
import { useCities } from "../Contexts/CityContexts";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useURLPosition();
  const navigate = useNavigate();
  const { createCity, isLoading } = useCities();
  const [cityName, setCityName] = useState("");
  const [countryName, setCountryName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geoLoactionError, setGeoLoactionError] = useState("");

  useEffect(
    function () {
      if (!lat && !lng) {
        return;
      }
      async function fetchCityData() {
        try {
          setIsGeoLoading(true);
          setGeoLoactionError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error("That doesn't seem like a country Mate 🍻");

          setCityName(
            data.city || data.locality || data.countryName || data.continent
          );
          setCountryName(data.countryName || data.continent);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (error) {
          setGeoLoactionError(error.message);
        } finally {
          setIsGeoLoading(false);
        }
      }
      fetchCityData();
    },
    [lng, lat]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      
      cityName,
      countryName,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  if (geoLoactionError) return <Message message={geoLoactionError} />;
  if (isGeoLoading) return <Spinner />;

  if (!lat && !lng) {
    return (
      <Message message="Start Adding the Cities by clicking on the Map👯‍♀️" />
    );
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Buttons type="primary">Add</Buttons>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
