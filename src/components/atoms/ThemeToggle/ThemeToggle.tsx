import { Button } from 'antd';
import { Theme } from '../../../shared/theme';
import { useSetThemeContext, useThemeContext } from '../../../contexts/theme-context';

const ThemeToggle = () => {
	const currentTheme = useThemeContext();
	const setStoredMode = useSetThemeContext();

	function toggleTheme(theme: Theme): Theme {
		if (theme === 'dark') return 'light';
		return 'dark';
	}

	return <Button onClick={() => setStoredMode(toggleTheme(currentTheme))}>Toggle dark mode</Button>;
};

export default ThemeToggle;
