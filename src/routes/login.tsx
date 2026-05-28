import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — IJ Group" }] }),
  component: LoginRedirect,
});

function LoginRedirect() {
  return <Navigate to="/" />;
}
