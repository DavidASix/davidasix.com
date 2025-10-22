import "~/styles/globals.css";

import { type Metadata } from "next";
import { Roboto_Flex, Jersey_10 } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { NoiseBackground } from "./_components/noise-background";

export const metadata: Metadata = {
  title: "DavidASix",
  description: "David A Six - Developer, Maker, Tech Enthusiast",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const roboto = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const jersey10 = Jersey_10({
  subsets: ["latin"],
  variable: "--font-jersey-10",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${jersey10.variable} bg-background`}
    >
      <body className="to-primary/10 text-foreground min-h-screen bg-gradient-to-b from-transparent">
        <NoiseBackground />
        <div className="relative z-10">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </div>
      </body>
    </html>
  );
}
