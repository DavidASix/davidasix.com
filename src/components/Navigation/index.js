import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import s from "./Navigation.module.css";
import cs from "src/styles/common.module.css";

export default function Navigation() {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    // Check for existing theme set or user preference and set it
    const docTheme = document.documentElement.getAttribute("data-theme");
    const savedTheme = localStorage.getItem("theme");
    const sysPref = window.matchMedia("(prefers-color-scheme: dark)").matches && 'dark';
    const theme = savedTheme || sysPref || docTheme || 'light';
    document.documentElement.setAttribute("data-theme", theme);
    setTheme(theme);
  }, []);

  function changeTheme() {
    if (typeof document === 'undefined') return;
    const currentTheme = document.documentElement.getAttribute("data-theme") || theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }

  const oppTheme = theme === 'dark' ? 'light' : 'dark';

  return (
      <div
        className={`container-fluid fixed-top pt-3 align-items-center ${s.navSize} `}
      >
        <nav
          className={`
            navbar navbar-expand-lg 
            navbar-light 
            p-2 pe-3 ps-3 
            rounded-4 shadow 
            ${cs.frosted}`}
        >
          <Link className={`navbar-brand ${s.navItem}`} href="/">
            Dave 6
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navBarContent"
            aria-controls="navBarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navBarContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={`nav-link grow ${s.navItem} ${cs.grow}`} href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link grow ${s.navItem} ${cs.grow}`} href="/excel">
                  Microsoft Excel
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link grow ${s.navItem} ${cs.grow}`} href="/blog">
                  Personal Blog
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav">
              <li className="nav-item">
                <button className={`btn ${"btn-"+oppTheme}`} onClick={() => changeTheme()}>
                  {oppTheme.charAt(0).toUpperCase() + oppTheme.slice(1)} Mode
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
  );
}
