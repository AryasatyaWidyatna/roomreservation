import React from "react";
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminHome from './page'

describe('AdminHome', () => {
test('menampilkan judul dan deskripsi', () => {
render(<AdminHome />)

expect(
  screen.getByRole('heading', { name: /Welcome Admin/i })
).toBeInTheDocument()

expect(
  screen.getByText(/Silakan kelola ruangan dan histori reservasi/i)
).toBeInTheDocument()
})
})