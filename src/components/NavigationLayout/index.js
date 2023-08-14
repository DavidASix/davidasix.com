import cs from "src/styles/common.module.css";
import NavBar from 'src/components/Navigation/';
import Footer from 'src/components/Footer/';

export const metadata = {
  title: 'Dave6',
  description: 'Home page of Dave6',
}

export default function NavigationLayout({ children }) {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className={`d-flex flex-column ${cs.center} ${cs.page}`}>
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}
