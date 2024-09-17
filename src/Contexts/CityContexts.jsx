import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import eachCities from "../components/CitiesData";

const BASE_URL = "http://localhost:8000";

const CityContext = createContext();

const initialValue = {
  cities: [],
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

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/delete":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };

    case "error":
      return { ...state, error: action.payload, isLoading: false };
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialValue
  );

  useEffect(function () {
    dispatch({ type: "cities/loading", payload: eachCities });
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "currentCity/loading", payload: data });
      } catch {
        dispatch({
          type: "error",
          payload:
            "There is an error loading the current City please try again...",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "error",
        payload: "There is an error creating the please try again...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/delete", payload: id });
    } catch {
      dispatch({
        type: "error",
        payload: "There is an error deleting the city please try again...",
      });
    }
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
