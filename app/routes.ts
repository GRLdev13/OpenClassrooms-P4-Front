import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("./routes/home-route.tsx"),
    route("login", "./routes/login-route.tsx"),
    route("register", "./routes/register-route.tsx"),
    route("files", "./routes/files-route.tsx"),
    // route("settings", "./routes/settings-route.tsx"),
] satisfies RouteConfig;
