import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "~/views/user/login";
import Register from "~/views/user/register";
import {
  usePutLoginMutation,
  usePutRegisterMutation,
} from "~/services/app-service";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
}));

jest.mock("~/services/app-service", () => ({
  usePutLoginMutation: jest.fn(),
  usePutRegisterMutation: jest.fn(),
}));

const mockUsePutRegisterMutation = jest.mocked(usePutRegisterMutation);
const mockUsePutLoginMutation = jest.mocked(usePutLoginMutation);

function setInputValue(container: HTMLElement, selector: string, value: string) {
  const input = container.querySelector(selector);

  if (!(input instanceof HTMLInputElement)) {
    throw new Error(`Input not found: ${selector}`);
  }

  return userEvent.type(input, value);
}

describe("user flows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("creates a user and redirects to login", async () => {
    const register = jest.fn((_payload: unknown) => ({
      unwrap: jest.fn().mockResolvedValue({
        email: "ada@example.com",
        token: "register-token",
      }),
    }));

    mockUsePutRegisterMutation.mockReturnValue([
      register,
      { error: undefined, isLoading: false, reset: jest.fn() },
    ] as unknown as ReturnType<typeof usePutRegisterMutation>);

    const { container } = render(<Register />);

    await setInputValue(container, "#firstName", "Ada");
    await setInputValue(container, "#lastName", "Lovelace");
    await setInputValue(container, "#email", "ada@example.com");
    await setInputValue(container, "#password", "correct-horse");
    await setInputValue(container, "#confirmPassword", "correct-horse");

    await userEvent.click(
      screen.getByRole("button", { name: /cr.{1,2}er un compte/i }),
    );

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.com",
          password: "correct-horse",
          passwordConfirmation: "correct-horse",
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("logs a user in, stores credentials, and redirects to files", async () => {
    const login = jest.fn((_payload: unknown) => ({
      unwrap: jest.fn().mockResolvedValue({
        email: "ada@example.com",
        token: "login-token",
      }),
    }));

    mockUsePutLoginMutation.mockReturnValue([
      login,
      { error: undefined, isLoading: false, reset: jest.fn() },
    ] as unknown as ReturnType<typeof usePutLoginMutation>);

    const { container } = render(<Login />);
    const form = container.querySelector("form");

    if (!(form instanceof HTMLFormElement)) {
      throw new Error("Login form not found");
    }

    await setInputValue(container, "#email", "ada@example.com");
    await setInputValue(container, "#password", "secret");

    await userEvent.click(within(form).getByRole("button", { name: /connexion/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "ada@example.com",
          password: "secret",
        }),
      );
      expect(localStorage.getItem("token")).toBe("login-token");
      expect(localStorage.getItem("email")).toBe("ada@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/files");
    });
  });
});
