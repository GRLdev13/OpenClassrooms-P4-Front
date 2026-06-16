import Login from "~/views/user/login";

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Login to your account" },
  ];
}

export default function LoginRoute() {
  return <Login />;
}
