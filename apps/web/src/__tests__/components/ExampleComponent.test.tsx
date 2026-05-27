import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ExampleComponent from '../../components/ExampleComponent'

describe('ExampleComponent', () => {
  test('renders without crashing', () => {
    render(<ExampleComponent />)
    expect(screen.getByText(/Example Component/i)).toBeDefined()
  })
})
