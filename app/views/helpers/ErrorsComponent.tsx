export type ErrorComponentProps = {
  error?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessages(error?: unknown): string[] {
  if (!error) {
    return [];
  }

  if (typeof error === "string") {
    return [error];
  }

  if (error instanceof Error) {
    return [error.message];
  }

  if (!isRecord(error)) {
    return ["An unexpected error occurred"];
  }

  if ("data" in error) {
    const data = error.data;

    if (typeof data === "string") {
      return [data];
    }

    if (data && typeof data === "object") {
      const response = data as {
        error?: string;
        message?: string;
        errors?: Record<string, string[]>;
      };

      if (response.errors) {
        return Object.values(response.errors).flat();
      }

      if (response.message) {
        return [response.message];
      }

      if (response.error) {
        return [response.error];
      }
    }

    if (error.status) {
      return [`Request failed with status ${String(error.status)}`];
    }
  }

  if ("error" in error && typeof error.error === "string") {
    return [error.error];
  }

  if ("error" in error) {
    return getErrorMessages(error.error);
  }

  if ("message" in error && typeof error.message === "string") {
    return [error.message];
  }

  return ["An unexpected error occurred"];
}

export default function ErrorComponent({ error }: ErrorComponentProps) {
  const messages = getErrorMessages(error);

  if (!messages.length) {
    return null;
  }

  return (
    <div className="text-center">
      <ul className="mb-4 text-red-500">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
