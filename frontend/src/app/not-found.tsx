import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild><Link href="/"><Home className="w-4 h-4 mr-2" /> Back to Home</Link></Button>
      </div>
    </div>
  );
}
