import "~/styles/globals.css";

import { type Metadata } from "next";
import { Roboto_Flex, Jersey_10 } from "next/font/google";
import HolyLoader from "holy-loader";

import { TRPCReactProvider } from "~/trpc/react";
import { NoiseBackground } from "./_components/noise-background";
import { Header } from "~/components/structure/header";
import { Footer } from "~/components/structure/footer";
import { PageBackground } from "~/components/structure/page-background";

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
      className={`${roboto.variable} ${jersey10.variable} bg-background scroll-smooth`}
    >
      <body className="text-foreground flex min-h-screen flex-col">
        <HolyLoader color="#a855f7" height={6} />
        <NoiseBackground />
        <PageBackground>
          <Header />
          <main className="flex-1">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
          <Footer />
        </PageBackground>
      </body>
    </html>
  );
}
