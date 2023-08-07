// import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import { Disclosure } from "@headlessui/react";
import logo from "../../public/img/productify-logo.svg";

export default function Navbar() {
  const navigation = ["Product", "Features", "Pricing", "Company", "Blog"];

  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                {/* <Link href="/"> */}
                <a className="flex items-center space-x-2 text-2xl font-medium  text-cool-gray-100">
                  <span>
                    <img
                      src={logo}
                      alt="N"
                      width="32"
                      height="32"
                      className="w-8"
                    />
                  </span>
                  <span>ArTrackrHub</span>
                </a>
                {/* </Link> */}

                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                  <>
                    {/* <Link href="/"> */}
                    <a
                      href="/app/dashboard"
                      className=" cursor-pointer w-full px-6 py-2 mt-3 text-center text-white rounded-md lg:ml-5 bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400"
                    >
                      Dashboard{" "}
                    </a>
                    {/* </Link> */}
                  </>
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>

        {/* menu  */}

        <div className="hidden mr-3 space-x-3 lg:flex nav__item">
          {/* <Link href="/"> */}
          <a
            href="/app/dashboard"
            className="cursor-pointer px-6 py-2 text-white bg-indigo-600 rounded-md md:ml-5"
          >
            Dashboard{" "}
          </a>
          {/* </Link> */}
        </div>
      </nav>
    </div>
  );
}
