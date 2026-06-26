import { render, screen } from "@testing-library/react";
import ErrorComponent from "~/views/helpers/ErrorsComponent";

describe("ErrorComponent", () => {
  test("does not render when no error is provided", () => {
    const { container } = render(<ErrorComponent />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders a plain string error", () => {
    render(<ErrorComponent error="Could not upload file" />);

    expect(screen.getByText("Could not upload file")).toBeInTheDocument();
  });

  test("renders an Error instance message", () => {
    render(<ErrorComponent error={new Error("Session expired")} />);

    expect(screen.getByText("Session expired")).toBeInTheDocument();
  });

  test("renders validation messages from a response errors object", () => {
    render(
      <ErrorComponent
        error={{
          data: {
            errors: {
              email: ["Email is required", "Email must be valid"],
              password: ["Password is required"],
            },
          },
        }}
      />,
    );

    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Email must be valid")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  test("renders response message and error fields", () => {
    const { rerender } = render(
      <ErrorComponent error={{ data: { message: "Account already exists" } }} />,
    );

    expect(screen.getByText("Account already exists")).toBeInTheDocument();

    rerender(<ErrorComponent error={{ data: { error: "Forbidden" } }} />);

    expect(screen.getByText("Forbidden")).toBeInTheDocument();
  });

  test("renders status and nested error fallbacks", () => {
    const { rerender } = render(
      <ErrorComponent error={{ status: 404, data: null }} />,
    );

    expect(screen.getByText("Request failed with status 404")).toBeInTheDocument();

    rerender(<ErrorComponent error={{ error: { message: "Nested failure" } }} />);

    expect(screen.getByText("Nested failure")).toBeInTheDocument();
  });

  test("renders a generic fallback for unknown error shapes", () => {
    render(<ErrorComponent error={{ code: "UNKNOWN" }} />);

    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
  });
});
