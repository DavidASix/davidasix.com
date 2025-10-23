import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 mt-auto w-full">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/favicon.ico"
              alt="DavidASix Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div className="text-foreground/80 flex flex-col text-sm">
              <span className="font-medium">David Anderson Six</span>
              <span className="text-foreground/60">Waterloo, Ontario</span>
            </div>
          </div>

          <div className="text-foreground/80 flex flex-col items-center text-sm sm:items-end">
            <span className="text-foreground/60">Red Oxford Online</span>
            <span className="text-foreground/60">
              &copy;1996 - {currentYear} DavidASix, all rights reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
