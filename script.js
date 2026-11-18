
document.getElementById("form").addEventListener("submit", async function (event) {

    event.preventDefault();

    let city = document.getElementById("city").value.trim();

    let cityname = document.getElementById("cityname");
    let temp = document.getElementById("temperature");
    let humi = document.getElementById("humidity");
    let condi = document.getElementById("condition");
    if (city === "") {
        cityname.innerText = "Please enter the city name";
        temp.innerText = "";
        humi.innerText = "";
        condi.innerText = "";
        return;
    }
        let url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        let response = await fetch(url);
        let data = await response.json();

        if (!data.results || data.results.length === 0) {
            cityname.innerText = "City Not Found";
            temp.innerText = "";
            humi.innerText = "";
            condi.innerText = "";
            return;
        }
        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;

        let city_name = data.results[0].name;
        let country = data.results[0].country;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;

        let weather_response = await fetch(weatherUrl);
        let weather_data = await weather_response.json();

        if (!weather_data.current) {
            cityname.innerText = "Unable to find weather";
            return;
        }
        let temperature = weather_data.current.temperature_2m;
        let humidity = weather_data.current.relative_humidity_2m;
        let condition = weather_data.current.weather_code;

        let weatherCondition = "";

        if (condition === 0) {
            weatherCondition = "Clear Sky";
        }
        else if (condition === 1) {
            weatherCondition = "Mainly Clear";
        }
        else if (condition === 2) {
            weatherCondition = "Partly Cloudy";
        }
        else if (condition === 3) {
            weatherCondition = "Overcast";
        }
        else if (condition === 45 || condition === 48) {
            weatherCondition = "Fog";
        }
        else if (condition >= 51 && condition <= 67) {
            weatherCondition = "Drizzle / Rain";
        }
        else if (condition >= 71 && condition <= 77) {
            weatherCondition = "Snow";
        }
        else if (condition >= 80 && condition <= 82) {
            weatherCondition = "Rain Showers";
        }
        else if (condition === 85 || condition === 86) {
            weatherCondition = "Snow Showers";
        }
        else if (condition >= 95 && condition <= 99) {
            weatherCondition = "Thunderstorm";
        }
        else {
            weatherCondition = "Unknown Condition";
        }

        cityname.innerText = city_name + ", " + country;

        temp.innerText = "Temperature: " + temperature + " °C";

        humi.innerText = "Humidity: " + humidity + " %";

        condi.innerText = "Condition: " + weatherCondition;    

});
