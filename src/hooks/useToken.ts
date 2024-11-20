import { useLocalStorage } from './useLocalStorage';

export function useToken() {
	return useLocalStorage<string | null>('token', null);
}
