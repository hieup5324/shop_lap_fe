import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, fallbackValue: T) {
	const [value, setValue] = useState(fallbackValue);

	// Getting the value from localStorage
	useEffect(() => {
		const stored = localStorage.getItem(key);

		setValue(stored ? JSON.parse(stored) : fallbackValue);
	}, [fallbackValue, key]);

	// Making sure to update the stored value whenever we change the
	// value in our state
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue] as const;
}
