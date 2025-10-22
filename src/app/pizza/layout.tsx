import { Lexend, Bagel_Fat_One } from "next/font/google";
import Image from "next/image";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const bagelFatOne = Bagel_Fat_One({
  subsets: ["latin"],
  variable: "--font-bagel-fat-one",
  display: "swap",
  weight: "400",
});

export default function PizzaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${lexend.variable} ${bagelFatOne.variable} bg-background/35 relative min-h-screen`}
      style={{
        fontFamily: "var(--font-lexend), sans-serif",
      }}
    >
      <Image
        src="/images/pizza-slice.webp"
        alt="Pizza slice decoration"
        width={300}
        height={300}
        className="pointer-events-none fixed right-10 bottom-10 z-10"
      />
      <div className="relative z-20">{children}</div>
    </div>
  );
}
