import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { Theme } from '../shared/theme';
import { useTheme } from '../hooks/useTheme';
import { WithChildrenProps } from '../shared/types';

// create contexts
const ThemeContext = createContext<Theme>('light');

const SetThemeContext = createContext<Dispatch<SetStateAction<Theme>>>((value) => {
	console.log('Default function:', value);
});

// wrapper functions for the hooks to access your context values
export function useThemeContext() {
	return useContext(ThemeContext);
}

export function useSetThemeContext() {
	return useContext(SetThemeContext);
}

// wrapper functions for providing your context
export function ThemeContextProvider({ children }: WithChildrenProps) {
	const [theme, setTheme] = useTheme();

	return (
		<ThemeContext.Provider value={theme}>
			<SetThemeContext.Provider value={setTheme}>{children}</SetThemeContext.Provider>
		</ThemeContext.Provider>
	);
}
