import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import eachCities from "../components/CitiesData";

const CityContext = createContext();

const initialValue = {
  cities: JSON.parse(localStorage.getItem("cities")) || eachCities, 
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loading":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "currentCity/loading":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created": {
      const updatedCities = [...state.cities, action.payload];
      localStorage.setItem("cities", JSON.stringify(updatedCities)); // Save to local storage
      return {
        ...state,
        cities: updatedCities,
        isLoading: false,
        currentCity: action.payload,
      };
    }

    case "city/delete": {
      const filteredCities = state.cities.filter(
        (city) => city.id !== action.payload
      );
      localStorage.setItem("cities", JSON.stringify(filteredCities)); // Save to local storage
      return {
        ...state,
        cities: filteredCities,
        isLoading: false,
        currentCity: {},
      };
    }

    case "error":
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialValue
  );

  // Load cities from local storage on app load
  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem("cities"));
    if (savedCities) {
      dispatch({ type: "cities/loading", payload: savedCities });
    }
  }, []);

  const getCity = useCallback(
    function getCity(id) {
      if (Number(id) === currentCity.id) return;

      const city = cities.find((city) => city.id === Number(id));

      if (city) {
        dispatch({ type: "currentCity/loading", payload: city });
      } else {
        dispatch({
          type: "error",
          payload: "City not found in the list",
        });
      }
    },
    [currentCity.id, cities]
  );

  function createCity(newCity) {
    dispatch({ type: "loading" });
    const newId =
      cities.length > 0 ? Math.max(...cities.map((city) => city.id)) + 1 : 1;
    const cityWithId = {
      ...newCity,
      id: newId,
    };

    dispatch({ type: "city/created", payload: cityWithId });
  }

  function deleteCity(id) {
    dispatch({ type: "loading" });
    dispatch({ type: "city/delete", payload: id });
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = useContext(CityContext);
  if (context === undefined)
    throw new Error("CityContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };