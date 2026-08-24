import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SearchPage from "./SearchPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <SearchPage />
    </Suspense>
  );
}
