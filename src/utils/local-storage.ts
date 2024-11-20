import LOCAL_STORAGE_KEY from '../shared/local-storage-key'

export const getLocalStorageLength = () => localStorage.length

export const clearLocalStorage = () => localStorage.clear()

export const getLocalStorageItem = (key: string): string | null =>
  localStorage.getItem(`${LOCAL_STORAGE_KEY.PREFIX}-${key}`)

export const setLocalStorageItem = (key: string, value: string) =>
  localStorage.setItem(`${LOCAL_STORAGE_KEY.PREFIX}-${key}`, value)

export const removeLocalStorageItem = (key: string) =>
  localStorage.removeItem(`${LOCAL_STORAGE_KEY.PREFIX}-${key}`)

export const keyLocalStorage = (index: number): string | null =>
  localStorage.key(index)

export const jsonParser = (jsonString: string) => {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error(e)
    clearLocalStorage()
    return {}
  }
}
