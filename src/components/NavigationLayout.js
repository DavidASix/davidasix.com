import NavBar from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NavigationLayout({ children }) {
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="bg-da-primary w-full h-20 absolute top-0" />
        <header className="sticky top-0 z-50 h-20">
          <NavBar />
        </header>
        <main
          className={`z-20 row pt-10 m-0 justify-content-center align-items-start`}
        >
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
}
