import { BookOpenCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Brand({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <BookOpenCheck className="size-5" />
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          Biz<span className="text-primary">Khata</span>
        </span>
      )}
    </div>
  );
}