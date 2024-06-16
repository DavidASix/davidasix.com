import Link from "next/link";
import c from "@/assets/constants";

export default function Footer() {
  return (
    <div className={`w-full min-h-48 ${c.sectionPadding} justify-center`}>
      <div
        className={`${c.contentContainer} w-full py-8 
        flex flex-col md:flex-row justify-between items-start`}
      >
        <div className="flex justify-center items-center">
          <Link href="/" className={`h-10 w-10 me-2`}>
            <img src="/favicon.ico" alt="Home Icon" />
          </Link>
          <div className="flex flex-col justify-center items-start space-y-1">
            <span className="text-sm text-da-dark-50">David Anderson Six</span>
            <span className="text-sm text-da-dark-50">Waterloo, Ontario</span>
          </div>
        </div>
        <div
          className={`flex flex-col justify-end items-end self-end md:self-auto`}
        >
          <a
            href="https://redoxfordonline.com/projects/?utm_source=davidasix&utm_medium=footer_menu&utm_campaign=referral"
            className="text-sm text-da-dark-50 hover:text-red-900 transition-all duration-150"
          >
            Red Oxford Online
          </a>
          <span className="text-sm text-ku-dark-muted">
            ©{new Date().getFullYear()} {c.siteName}, all rights reserved
          </span>
        </div>
      </div>
    </div>
  );
}
