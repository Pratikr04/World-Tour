import Spinner from "./Spinner";
import styles from "./CountryList.module.css";
import EachCountry from "./EachCountry";
import Message from "./Message";
import { useCities } from "../Contexts/CityContexts";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first Country by clicking on the map!!" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <EachCountry country={country} key={Math.random()} />
      ))}
    </ul>
  );
}
export default CountryList;
