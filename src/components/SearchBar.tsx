import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
    onSearch: (city: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
    const [city, setCity] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selected, setSelected] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (city.length < 2 || selected) {
            setSuggestions([]);
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            if (abortRef.current) {
                abortRef.current.abort();
            }

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

                const response = await fetch(url, {
                    signal: controller.signal,
                });

                const data = await response.json();

                if (!controller.signal.aborted) {
                    setSuggestions(data.results || []);
                }
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.log("Error fetching cities:", error);
                }
            }
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            if (abortRef.current) {
                abortRef.current.abort();
            }
        };
    }, [city, selected]);

    const closeSuggestions = () => {
        setSuggestions([]);
        setActiveIndex(-1);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (abortRef.current) {
            abortRef.current.abort();
        }
    };

    const handleSelectCity = (cityName: string) => {
        setSelected(true);
        setCity(cityName);
        closeSuggestions();
        onSearch(cityName);
    };

    const handleClick = () => {
        if (!city.trim()) return;

        setSelected(true);
        closeSuggestions();
        onSearch(city);
    };

    return (
        <div className="flex items-center relative">
            <input
                type="text"
                placeholder="Enter City..."
                value={city}
                onChange={(e) => {
                    setCity(e.target.value);
                    setSelected(false);
                    setActiveIndex(-1);
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        e.preventDefault();

                        setActiveIndex((prev) =>
                            prev < suggestions.length - 1 ? prev + 1 : prev,
                        );
                    }

                    if (e.key === "ArrowUp") {
                        e.preventDefault();

                        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    }

                    if (e.key === "Enter") {
                        e.preventDefault();

                        if (activeIndex >= 0 && suggestions[activeIndex]) {
                            handleSelectCity(suggestions[activeIndex].name);
                        } else if (city.trim() !== "") {
                            setSelected(true);
                            closeSuggestions();
                            onSearch(city);
                        }
                    }
                }}
                className="border-2 rounded-2xl pl-3 w-64 border-blue-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    {suggestions.map((place, index) => (
                        <li
                            key={`${place.name}-${place.country}-${index}`}
                            className={`p-2 cursor-pointer ${
                                index === activeIndex
                                    ? "bg-blue-200"
                                    : "hover:bg-blue-100"
                            }`}
                            onMouseDown={() => {
                                handleSelectCity(place.name);
                            }}
                        >
                            {place.name}, {place.country}
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={handleClick}
                className="border border-blue-900 bg-blue-900 rounded-2xl pl-2 pr-2 ml-3 text-white cursor-pointer hover:bg-blue-800 hover:border-blue-800 transition-all"
            >
                Search
            </button>
        </div>
    );
}

export default SearchBar;
