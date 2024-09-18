import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import EachCity from "./EachCity";
import Message from "./Message";
import { useCities } from "../Contexts/CityContexts";

function CityList() {
  
  const{cities,isLoading} = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map!!" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <EachCity city={city} key={city.id} />
      ))}
    </ul>
  );
}
export default CityList;
