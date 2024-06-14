import c from "/src/assets/constants";
import s from "./Footer.module.css";

export default function Footer() {
  return (
      <div className={`col-12 row ${s.footer} justify-content-center align-items-center`}>
        <div className="col-11 col-md-10 d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
          <div className="col-md-8 d-flex align-items-center">
            <a
              href="/"
              className={`d-md-flex d-none me-4`}
              style={{ height: 25, width: 25}}
            >
              <img
                src="/favicon.ico"
                className='img-fluid'
                alt="Home Icon"
              />
            </a>
            <div className="d-flex flex-column justify-content-center align-items-start">
              <span className="fs-6">
                © {new Date().getFullYear()} {c.siteName}, all rights reserved
              </span>
            </div>
          </div>
          
          <div className={`d-flex col-12 col-md-4 justify-content-end`}>
            <a 
              href="http://redoxfordonline.com" 
              className="fst-italic fs-small text-end hover hover-muted">
              Site created by RedOxfordOnline
            </a>
          </div>
        </div>
      </div>
  );
}
