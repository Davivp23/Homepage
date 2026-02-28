import { useState, useEffect } from 'react';
import SunCalc from 'suncalc';

const LAT = 41.447; // Set your own coordinates
const LON = 1.86;   // You can find them on google maps
// Lat N positive, S negative
// Lon E positive, W negative

export function useDynamicTheme() {
    const [debugDate, setDebugDate] = useState<Date | null>(null);

    const [theme, setTheme] = useState({
        period: 'day',
        isRaining: false,
        loading: true
    });

    useEffect(() => {
        const fetchWeather = async () => {
            const now = debugDate || new Date();
            const times = SunCalc.getTimes(now, LAT, LON);

            console.log(times);
            console.log(now);

            let period: 'loading' | 'day' | 'night' | 'dawn';
            if (now > times.night || now < times.nightEnd) {
                period = 'night';
            }
            else if (now > times.goldenHour || now < times.goldenHourEnd) {
                period = 'dawn';
            }
            else {
                period = 'day';
            }

            let isRaining = false;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 1000);

            try {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=weather_code`, // Not worth it including this in the api links file
                    { signal: controller.signal }
                );
                const data = await res.json();
                clearTimeout(timeoutId);

                const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82];
                isRaining = rainCodes.includes(data.current.weather_code);
            } catch (err) {
                console.log("🌦️ Clima: Timeout o error, ignorando lluvia.");
            }

            setTheme({ period, isRaining, loading: false });
        };

        fetchWeather();
    }, [debugDate]);

    useEffect(() => {
        (window as any).setHourDebug = (h: number, m: number = 0) => {
            const d = new Date();
            d.setHours(h);
            d.setMinutes(m);
            setDebugDate(d);
            console.log(`🕒 Hora virtual fijada a las ${h}:${m}`);
        };
    }, []);

    return theme;
}