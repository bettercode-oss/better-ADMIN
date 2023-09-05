import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import IndexPage from "../../src/pages";

jest.mock("@/lib/auth/auth-provider", () => {
  return {
    useAuth: () => {
      return {
        session: {
          user: {
            name: "유영모"
          }
        }
      };
    },
  };
});

describe('Home', () => {
  it('renders a heading', () => {

    render(<IndexPage />)

    const heading = screen.getByRole('heading', {
      name: /👋 유영모님 안녕하세요!/i,
    })

    expect(heading).toBeInTheDocument()
  })
})