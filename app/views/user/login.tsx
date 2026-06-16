import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { LoginUserDTO } from "~/app/dto/UserDTO";
import { usePutLoginMutation } from "~/services/app-service";
import ErrorComponent from "~/views/helpers/ErrorsComponent";
import { setUser } from "~/stores/userSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [putUser, { error, isLoading }] = usePutLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userDTO = new LoginUserDTO({
      email,
      password,
    });

    try {
      const response = await putUser(userDTO).unwrap();
      localStorage.setItem("token", response.token);
      dispatch(
        setUser({
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
        }),
      );
      navigate("/dashboards");
    } catch (error) {}
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white p-6 dark:bg-zinc-950 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Link to="/" className="flex flex-col items-center gap-2 font-medium">
          <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 42"
              className="size-9 fill-current text-black dark:text-white"
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Arial, sans-serif"
                fontSize="28"
                fill="currentColor"
              >
                R
              </text>
            </svg>
          </span>
          <span className="sr-only">Renote</span>
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex w-full flex-col text-center">
            <h1 className="text-2xl font-medium text-zinc-800 dark:text-white">
              Log in to your account
            </h1>
            <p className="text-sm text-zinc-500 dark:text-white/70">
              Enter your email and password below to log in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="block min-w-0">
              <label
                htmlFor="email"
                className="mb-3 inline-flex items-center text-sm font-medium text-zinc-800 dark:text-white"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="email@example.com"
                className="block h-10 w-full appearance-none rounded-lg border border-zinc-200 border-b-zinc-300/80 bg-white px-3 py-2 text-base leading-[1.375rem] text-zinc-700 shadow-xs placeholder-zinc-400 disabled:text-zinc-500 disabled:placeholder-zinc-400/70 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300 dark:placeholder-zinc-400 dark:shadow-none sm:text-sm"
              />
            </div>

            <div className="relative">
              <div className="block min-w-0">
                <label
                  htmlFor="password"
                  className="mb-3 inline-flex items-center text-sm font-medium text-zinc-800 dark:text-white"
                >
                  Password
                </label>
                <div className="relative block w-full">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Password"
                    className="block h-10 w-full appearance-none rounded-lg border border-zinc-200 border-b-zinc-300/80 bg-white py-2 pe-10 ps-3 text-base leading-[1.375rem] text-zinc-700 shadow-xs placeholder-zinc-400 disabled:text-zinc-500 disabled:placeholder-zinc-400/70 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300 dark:placeholder-zinc-400 dark:shadow-none sm:text-sm"
                  />
                  <div className="absolute bottom-0 end-0 top-0 flex items-center pe-3 text-xs text-zinc-400">
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="-me-1 -ms-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent text-sm font-medium text-zinc-500 hover:bg-zinc-800/5 hover:text-zinc-800 disabled:pointer-events-none disabled:cursor-default disabled:opacity-75 dark:text-zinc-400 dark:hover:bg-white/15 dark:hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg
                          className="size-4 shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z"
                            clipRule="evenodd"
                          />
                          <path d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z" />
                        </svg>
                      ) : (
                        <svg
                          className="size-4 shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                          <path
                            fillRule="evenodd"
                            d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Link
                to="#"
                className="absolute end-0 top-0 inline text-sm font-medium text-zinc-800 underline underline-offset-[6px] decoration-zinc-800/20 hover:decoration-current dark:text-white dark:decoration-white/30"
              >
                Forgot your password?
              </Link>
            </div>

            {error && <ErrorComponent error={error} />}

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-black/10 bg-zinc-900 px-4 text-sm font-medium text-white shadow-[inset_0px_1px_rgba(255,255,255,0.2)] hover:bg-zinc-800 disabled:pointer-events-none disabled:cursor-default disabled:opacity-75 dark:border-0 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </div>
          </form>

          <div className="space-x-1 text-center text-sm text-zinc-600 dark:text-zinc-400 rtl:space-x-reverse">
            <span>Don't have an account?</span>
            <Link
              to="/register"
              className="inline font-medium text-zinc-800 underline underline-offset-[6px] decoration-zinc-800/20 hover:decoration-current dark:text-white dark:decoration-white/30"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
