import s from "./Footer.module.css";

export default function Footer() {
  return (
      <div className={`container-fluid bg-dark py-4 ${s.footer}`}>
        <div className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <a
              href="/"
              className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
              style={{ height: 25, width: 25, position: 'relative', justifyContent: 'center', alignItems: 'center'}}
            >
              <img
                src="/images/favicon.ico"
                style={{ position: 'absolute', width: '100%' }}
                alt="Home Icon"
              />
            </a>
            <div className="d-flex flex-column justify-content-center align-items-center">
              <span className="text-light">
                © 2021 David Anderson, all rights reserved
              </span>
            </div>
          </div>

          <a className="text-light" href="http://dave6.com">
            Created by Dave 6
          </a>
        </div>
      </div>
  );
}
