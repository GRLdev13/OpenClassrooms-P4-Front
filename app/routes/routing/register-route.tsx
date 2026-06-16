import Register from "~/views/user/register";

export function meta() {
  return [
    { title: "Register" },
    { name: "description", content: "Create a new account" },
  ];
}

export default function RegisterRoute() {
  return <Register />;
}
