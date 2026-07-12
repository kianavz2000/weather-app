import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

function App() {
    const [weatherData, setWeatherData] = useState<any>(null);

    const handleSearch = async (cityName: string) => {
        const url = `https://wttr.in/${cityName}?format=j1`;

        try {
            const response = await fetch(url); //درخواست میفرستیم
            const data = await response.json(); //فرمت جواب رو میکنیم json
            setWeatherData(data);
        } catch (error) {
            console.log("There is a problem", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-green-200 to-blue-300">
            <h1 className="text-4xl text-blue-900 font-bold mb-3">
                Weather App
            </h1>
            <SearchBar onSearch={handleSearch} />
            {weatherData && <WeatherCard data={weatherData} />}
        </div>
    );
}

export default App;
