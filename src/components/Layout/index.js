import cs from "src/styles/common.module.css";
import NavBar from 'src/components/Navigation/';
import Footer from 'src/components/Footer/';

export const metadata = {
  title: 'Dave6',
  description: 'Home page of Dave6',
}

export default function Layout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script async src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossOrigin="anonymous"></script>
        <script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js" integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V" crossOrigin="anonymous"></script>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/*
        <link href="https://fonts.googleapis.com/css2?family=Copse&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Laila:wght@300&display=swap" rel="stylesheet">
        */}
        <link href="https://fonts.googleapis.com/css2?family=Quicksand&family=Major+Mono+Display&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/baron-neue" rel="stylesheet" />
      </head>
      <body>
        <header>
          <NavBar />
        </header>
        <main className={`d-flex flex-column ${cs.center} ${cs.page}`}>
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  )
}
