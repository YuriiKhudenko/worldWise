# WorldWise

"This application allows you to select any location or city on the map that you have visited, providing the option to save detailed information such as the city name, date of visit, and personal notes about the place. It utilizes a reverse-geocode API to automatically detect and populate the city name in the form. Additionally, the app features simulated authentication, routing functionality, and includes several supplementary pages for an enhanced user experience."

## Technologies

- **React**: The primary library for building user interfaces.
- **Context API**: Used for state management and passing functionality between components without the need for prop drilling.
- **useReducer hook**: Employed for managing complex state with reduced boilerplate code and support for predictable changes.
- **react-leaflet**: Integrated for interactive and dynamic maps within the React environment.
- **reverse-geocode-client**: Utilized for reverse geocoding, providing the capability to automatically detect and populate city names based on map coordinates.

## Installation and Running

1. Clone the repository: `git clone https://github.com/YuriiKhudenko/worldWise`
2. Navigate to the project directory: `cd worldWise`
3. Install dependencies: `npm install`
4. Run the project: `npm run dev`
5. Run the json server: `npm run server`
