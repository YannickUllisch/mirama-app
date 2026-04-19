// src/modules/shared/hooks/utils/useLocalStorage.ts
import { useState, useEffect } from 'react'

const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedValue = localStorage.getItem(key)
        return storedValue ? (JSON.parse(storedValue) as T) : defaultValue
      } catch (_) {
        return defaultValue
      }
    }
    return defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue] as const
}

export default useLocalStorage
