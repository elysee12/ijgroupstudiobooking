import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — IJ Group" }] }),
  component: RegisterRedirect,
});

function RegisterRedirect() {
  return <Navigate to="/" />;
}
