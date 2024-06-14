import NavBar from 'src/components/Navigation/';
import Footer from 'src/components/Footer/';

export default function NavigationLayout({ children }) {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className={`row p-0 m-0 justify-content-center align-items-start`}>
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}
