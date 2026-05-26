import logo from "@/assets/logo.jpeg";
import { Link } from "@tanstack/react-router";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src={logo} alt="IJ Group" width={size} height={size} className="rounded-md object-cover" style={{ width: size, height: size }} />
      <span className="font-display text-xl tracking-wider text-foreground hidden sm:inline">
        IJ <span className="text-primary">GROUP</span>
      </span>
    </Link>
  );
}
