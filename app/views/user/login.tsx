import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { LoginUserDTO } from "~/dto/user/login-user-dto";
import { usePutLoginMutation } from "~/services/app-service";
import ErrorComponent from "~/views/helpers/ErrorsComponent";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [putUser, { error, isLoading }] = usePutLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userDTO = new LoginUserDTO({
      email,
      password,
    });

    try {
      const response = await putUser(userDTO).unwrap();
      localStorage.setItem("token", response.token);
      localStorage.setItem("email", response.email);
      navigate("/files");
    } catch (error) {}
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
        <span className="rounded-md bg-[#292929] px-4 py-2 text-xs text-white shadow-sm">
          Se connecter
        </span>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[590px] rounded-xl bg-white px-5 py-7 shadow-[0_3px_10px_rgba(44,26,23,0.28)] sm:px-6">
          <h1 className="mb-7 text-center text-xl font-bold">Connexion</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs text-zinc-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="Saisissez votre email..."
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-[#ee8a5b] focus:ring-2 focus:ring-[#ee8a5b]/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs text-zinc-800">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="Saisissez votre mot de passe..."
                className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-[#ee8a5b] focus:ring-2 focus:ring-[#ee8a5b]/20"
              />
            </div>

            {error && <ErrorComponent error={error} />}

            <div className="space-y-4 pt-1 text-center">
              <Link
                to="/register"
                className="inline-block text-xs text-[#e8783f] transition-colors hover:text-[#bd5627] hover:underline"
              >
                Créer un compte
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-10 w-full items-center justify-center rounded-md border border-[#f29a70] bg-[#fff4ee] px-4 text-xs font-medium text-[#d96831] transition-colors hover:bg-[#fee7db] focus:outline-none focus:ring-2 focus:ring-[#ee8a5b]/35 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Connexion..." : "Connexion"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="px-6 py-5 text-xs text-white sm:px-12 lg:px-[6.5%]">
        Copyright DataShare® 2025
      </footer>
    </main>
  );
}
