import s from "./Navigation.module.css";
const links = [
  {title: 'Home', url: '/'},
  {title: 'Blog', url: 'blog'},
  {title: 'Excel', url: '/excel'},
  {title: 'Data', url: '/data'},
  {title: 'Apps', url: '/mobile-apps'},
  //{title: 'Web', url: 'web-dev'},
]

export default function Navigation() {
  const oppTheme = false === 'dark' ? 'light' : 'dark';
  return (
    <>
    <div className={`row fixed-top py-2 px-3 ${s.navSize}`}>
        <nav
          className={`
            navbar navbar-expand-lg navbar-dark align-content-start
            navbar-light px-3 py-2 frosted frosted-lg-0 rounded-5`}
            style={{minHeight: 'unset'}}
        >
          <a className={`text-light hover fs-3 fw-normal p-0 m-0`} href="/">
            DavidASix
          </a>
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navBarContent"
            aria-controls="navBarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon shadow-0"></span>
          </button>
          <div 
            className="collapse navbar-collapse d-lg-flex justify-content-center position-relative text-center" 
            id="navBarContent">
            <ul className={`navbar-nav frosted-0 frosted-lg rounded-pill px-4 flex-row flex-wrap ${s.navContentContainer}`}>
            {links.map((link, i) => (
              <li key={i} className={`text-center py-2 px-4 col-6 col-md-4 col-lg-auto`}>
                <a 
                  className={`hover hover-danger grow text-center text-nowrap fs-5 fs-lg-6`} 
                  style={{textTransform: 'none'}}
                  href={link.url}>
                  {link.title}
                </a>
              </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      </>
  );
}