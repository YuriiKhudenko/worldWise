import { useEffect, useState } from "react";

// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

export const useGetCityByCoordinates = (lat, lng) => {
  const [cityNameByGeo, setCityNameByGeo] = useState();
  const [countryByGeo, setCountryByGeo] = useState();
  const [emoji, setEmoji] = useState("");
  const [isCityByGeoLoading, setIsCityByGeoLoading] = useState(false);
  const [isCityByGeoError, setIsCityByGeoError] = useState("");

  useEffect(() => {
    const fetchCity = async () => {
      if (!lat && !lng) return;

      try {
        setIsCityByGeoLoading(true);
        setIsCityByGeoError(null);

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();

        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else😉"
          );

        setCityNameByGeo(data.city);
        setCountryByGeo(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (e) {
        setIsCityByGeoError(e.message);
      } finally {
        setIsCityByGeoLoading(false);
      }
    };

    fetchCity();
  }, [lat, lng]);

  return {
    cityNameByGeo,
    emoji,
    countryByGeo,
    isCityByGeoLoading,
    isCityByGeoError,
    setCityNameByGeo,
  };
};
