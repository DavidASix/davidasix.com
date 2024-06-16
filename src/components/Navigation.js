import { useState } from "react";
import { useRouter } from "next/router";

const links = [
  { title: "Home", url: "/", text: "where the heart is" },
  { title: "Blog", url: "/blog", text: "scattered thoughts" },
  { title: "Excel", url: "/excel", text: "favourite formulas" },
  //{title: 'Projects', url: '/projects', text: 'This is a sentence'},
  { title: "Apps", url: "/mobile-apps", text: "react-native apps" },
  {
    title: "ROO",
    url: "https://redoxfordonline.com/projects/?utm_source=davidasix&utm_medium=main_menu&utm_campaign=referral",
    text: "web-dev business",
  },
];

const NavLink = (props) => {
  const { link, currentPath } = props;
  if (link?.options) {
    return (
      <li className="dropdown dropdown-hover">
        <div
          tabIndex={0}
          role="button"
          className={`h-min ${
            link.options.map((l) => l.url).includes(currentPath)
              ? "text-ku-green font-bold"
              : "md:link-clean"
          }`}
        >
          {link.title}
        </div>
        <ul
          tabIndex={0}
          className="md:dropdown-content z-[1] md:menu md:p-2 
            md:shadow md:bg-base-100 md:rounded-box md:w-52 
            space-y-2 mt-2 md:space-y-0 md:mt-0"
        >
          {link.options.map((l, i) => (
            <li
              key={i}
              className={`ps-4 list-disc list-inside md:ps-0 md:list-none
              ${
                l.url === currentPath ? "text-ku-green font-bold" : "link-clean"
              }`}
            >
              <a href={l.url}>{l.title}</a>
            </li>
          ))}
        </ul>
      </li>
    );
  }
  return (
    <li className="w-full h-min">
      <a
        href={link.url}
        className={`flex justify-between ${
          link.url === currentPath
            ? "text-da-primary-400 font-bold"
            : "text-da-dark-100 hover:text-da-primary-300"
        }`}
      >
        <span className="my-auto text-inherit">{link.title}</span>
        <span className="text-sm italic font-light ps-4 text-end md:hidden text-inherit">
          {" "}
          {link.text}
        </span>
      </a>
    </li>
  );
};

export default function Navigation() {
  const [expanded, setExpanded] = useState(false);
  const expandedStyle = expanded ? "h-56" : "h-12";

  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <>
      <div
        className="flex items-center justify-end px-3 md:px-3 py-2"
        aria-label="Main Menu"
      >
        <nav
          className={`${expandedStyle} relative overflow-hidden md:overflow-visible
            flex justify-between px-4
            w-full frosted rounded-3xl
            md:frosted-0
            transition-all duration-300
            `}
        >
          <div className="h-12 w-full flex items-center justify-between">
            <div className="flex w-full flex-row items-center space-y-4 md:space-y-0">
              <span className="text-2xl me-1 header-font cursor-default text-da-dark-50">
                DavidASix
              </span>
              <div className="flex-1 flex justify-center items-center">
                <ul
                  className="w-full md:w-auto
                absolute top-12 start-0 flex flex-col space-y-2
                md:frosted md:rounded-full py-2 px-10
                md:relative md:top-auto md:start-auto md:flex-row md:space-y-0 md:space-x-10 md:justify-center"
                >
                  {links.map((link, i) => (
                    <NavLink key={i} link={link} currentPath={currentPath} />
                  ))}
                </ul>
              </div>
            </div>

            <button
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex md:hidden w-14 h-14 items-center justify-center 
                rounded-lg"
              aria-controls="navbar-default"
              aria-expanded="false"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5 stroke-da-dark-50"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 1h10M0 7h16M3 14h10"
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
