import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { RegisterUserDTO } from "~/dto/user/register-user-dto";
import ErrorComponent from "~/views/helpers/ErrorsComponent";
import { usePutRegisterMutation } from "~/services/app-service";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [putUser, { error, isLoading }] = usePutRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userDTO = new RegisterUserDTO({
      firstName: firstName,
      lastName: lastName,
      email,
      password,
      passwordConfirmation: confirmPassword,
    });


    try {
      if(await putUser(userDTO).unwrap())
      navigate("/login");
    } catch (error) {
      
    }
  };

  return (
    <main className="flex min-h-svh flex-col bg-gradient-to-b from-[#ffb382] via-[#f58c78] to-[#e96368] font-sans text-zinc-900">
      <header className="flex items-center justify-between px-6 py-4 sm:px-12 lg:px-[6.5%]">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-black transition-opacity hover:opacity-70"
        >
          DataShare
        </Link>
        <Link
          to="/login"
          className="rounded-md bg-[#292929] px-4 py-2 text-xs text-white shadow-sm transition-colors hover:bg-black"
        >
          Se connecter
        </Link>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[590px] rounded-xl bg-white px-5 py-7 shadow-[0_3px_10px_rgba(44,26,23,0.28)] sm:px-6">
          <h1 className="mb-7 text-center text-xl font-bold">
            Créer un compte
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-xs text-zinc-800"
                >
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  autoComplete="given-name"
                  placeholder="Saisissez votre prénom..."
                  className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-[#ee8a5b] focus:ring-2 focus:ring-[#ee8a5b]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-xs text-zinc-800"
                >
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  autoComplete="family-name"
                  placeholder="Saisissez votre nom..."
                  className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-[#ee8a5b] focus:ring-2 focus:ring-[#ee8a5b]/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs text-zinc-800"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="Saisissez votre email..."
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-[#ee8a5b] focus:ring-2 focus:ring-[#ee8a5b]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs text-zinc-800"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Saisissez votre mot de passe..."
                  className="h-10 w-full rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-11 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-[#ee8a5b] focus:ring-2 focus:ring-[#ee8a5b]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-700 focus:outline-none"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <svg
                      className="size-4"
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
                      className="size-4"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs text-zinc-800"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
                placeholder="Confirmez votre mot de passe..."
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-[#ee8a5b] focus:ring-2 focus:ring-[#ee8a5b]/20"
              />
            </div>

            {error && <ErrorComponent error={error} />}

            <div className="space-y-4 pt-1 text-center">
              <Link
                to="/login"
                className="inline-block text-xs text-[#e8783f] transition-colors hover:text-[#bd5627] hover:underline"
              >
                Déjà un compte ? Se connecter
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-10 w-full items-center justify-center rounded-md border border-[#f29a70] bg-[#fff4ee] px-4 text-xs font-medium text-[#d96831] transition-colors hover:bg-[#fee7db] focus:outline-none focus:ring-2 focus:ring-[#ee8a5b]/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Création..." : "Créer un compte"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="px-6 py-5 text-xs text-white sm:px-12 lg:px-[6.5%]">
        Copyright DataShare® 2026
      </footer>
    </main>
  );
}
