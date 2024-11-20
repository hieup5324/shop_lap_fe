import LOCAL_STORAGE_KEY from '../shared/local-storage-key';
import { Theme } from '../shared/theme';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
	return useLocalStorage<Theme>(LOCAL_STORAGE_KEY.THEME, 'light');
}
