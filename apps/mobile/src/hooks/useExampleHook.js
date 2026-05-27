import { useState, useEffect } from 'react'

export default function useExampleHook() {
  const [value, setValue] = useState('ready')

  useEffect(() => {
    const timeout = setTimeout(() => setValue('completed'), 10)
    return () => clearTimeout(timeout)
  }, [])

  return { value }
}
