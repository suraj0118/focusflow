import { renderHook, waitFor } from '@testing-library/react'
import { describe, test, expect } from '@jest/globals'
import useExampleHook from '../../src/hooks/useExampleHook.js'

describe('useExampleHook', () => {
  test('returns expected values', async () => {
    const { result } = renderHook(() => useExampleHook())
    await waitFor(() => {
      expect(result.current.value).toBe('completed')
    })
  })
})
