export interface WeatherCardProps {
    data: any;
}

function WeatherCard({ data }: WeatherCardProps) {
    const city = data.nearest_area[0].areaName[0].value;
    const temperature = data.current_condition[0].temp_C;
    const description = data.current_condition[0].weatherDesc[0].value;
    const humidity = data.current_condition[0].humidity;
    const windSpeed = data.current_condition[0].windspeedKmph;

    return (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg text-center w-72">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">{city}</h2>

            <p className="text-3xl font-bold mb-2">🌡 {temperature}°C</p>

            <p className="text-gray-700 mb-2">{description}</p>

            <p className="text-gray-700">💧 Humidity: {humidity}%</p>

            <p className="text-gray-700">💨 Wind: {windSpeed} km/h</p>
        </div>
    );
}

export default WeatherCard;
