const CODES: Record<number, string> = {
	0: 'Clear sky ☀️',
	1: 'Mainly clear 🌤️',
	2: 'Partly cloudy ⛅',
	3: 'Overcast ☁️',
	45: 'Fog 🌫️',
	48: 'Rime fog 🌫️',
	51: 'Light drizzle 🌦️',
	53: 'Drizzle 🌦️',
	55: 'Heavy drizzle 🌧️',
	61: 'Light rain 🌦️',
	63: 'Rain 🌧️',
	65: 'Heavy rain 🌧️',
	71: 'Light snow 🌨️',
	73: 'Snow 🌨️',
	75: 'Heavy snow ❄️',
	80: 'Rain showers 🌦️',
	81: 'Rain showers 🌧️',
	82: 'Violent showers ⛈️',
	95: 'Thunderstorm ⛈️',
	96: 'Thunderstorm ⛈️',
	99: 'Thunderstorm ⛈️'
};

const describe = (code: number) => CODES[code] ?? 'Unknown';
const round = (n: number) => Math.round(n);

export async function getWeather(city: string): Promise<string> {
	try {
		const geo: any = await fetch(
			`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
		).then((r) => r.json());

		const place = geo?.results?.[0];
		if (!place) return `I couldn't find "${city}". Check the spelling?`;

		const { latitude, longitude, name, country } = place;
		const data: any = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
				`&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
				`&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2`
		).then((r) => r.json());

		const c = data.current;
		const d = data.daily;

		return [
			`*${name}, ${country}*`,
			`${describe(c.weather_code)}  ${round(c.temperature_2m)}°C`,
			`💧 ${c.relative_humidity_2m}%    💨 ${round(c.wind_speed_10m)} km/h`,
			'',
			`Today: ${round(d.temperature_2m_min[0])}–${round(d.temperature_2m_max[0])}°C`,
			`Tomorrow: ${describe(d.weather_code[1])} ${round(d.temperature_2m_min[1])}–${round(d.temperature_2m_max[1])}°C`
		].join('\n');
	} catch {
		return 'Could not reach the weather service. Try again in a moment.';
	}
}
