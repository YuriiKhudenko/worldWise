import { createContext, useContext, useEffect, useReducer } from "react";
import { CITIES_URL } from "../constants";
import {
  SET_CITIES,
  START_LOADING,
  FINISH_LOADING,
  SET_CURRENT_CITY,
  REJECTED,
} from "./actions";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case FINISH_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case SET_CITIES:
      return {
        ...state,
        cities: action.payload,
      };
    case SET_CURRENT_CITY:
      return { ...state, isLoading: false, currentCity: action.payload };
    case REJECTED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
};

const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    dispatch({ type: START_LOADING });
    fetch(CITIES_URL)
      .then((result) => {
        if (!result.ok) {
          throw new Error("Error with fetching data");
        }
        return result.json();
      })
      .then((citiesData) => {
        dispatch({ type: SET_CITIES, payload: citiesData });
      })
      .catch((error) => alert(error))
      .finally(() => dispatch({ type: FINISH_LOADING }));
  }, []);

  const getCity = async (id) => {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: START_LOADING });

    try {
      const res = await fetch(`${CITIES_URL}/${id}`);
      const data = await res.json();
      dispatch({ type: SET_CURRENT_CITY, payload: data });
    } catch {
      dispatch({
        type: REJECTED,
        payload: "There was an error loading the city...",
      });
    }
  };

  const addNewCity = async (city) => {
    try {
      dispatch({ type: START_LOADING });
      const res = await fetch("http://localhost:8000/cities", {
        method: "POST",
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      const data = await res.json();
      dispatch({ type: SET_CITIES, payload: [...cities, data] });
    } catch {
      dispatch({
        type: REJECTED,
        payload: "There was an error creating city...",
      });
    } finally {
      dispatch({ type: FINISH_LOADING });
    }
  };

  const removeCity = async (id) => {
    try {
      dispatch({ type: START_LOADING });
      const response = await fetch(`http://localhost:8000/cities/${id}`, {
        method: "DELETE",
        credentials: "same-origin", // include, *same-origin, omit
      });
      if (!response.ok) throw new Error("there was an arror deleting data");
      const data = await fetch(CITIES_URL);
      const dataFetch = await data.json();
      dispatch({ type: SET_CITIES, payload: [...dataFetch] });
      // setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      dispatch({
        type: REJECTED,
        payload: "There was an error deleting the city...",
      });
    } finally {
      dispatch({ type: FINISH_LOADING });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        addNewCity,
        removeCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCitiesContext = () => {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");

  return context;
};

export { CitiesProvider, useCitiesContext };