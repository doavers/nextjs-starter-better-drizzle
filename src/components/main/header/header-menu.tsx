/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { isEmpty } from "@/lib/common";

import MenuData from "../../../data/menu-data";

function HeaderMenu({ isNavbarOpen }: { isNavbarOpen: boolean }) {
  const pathUrl = usePathname();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    console.log("navbarToggleHandler called", !navbarOpen);
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);

  // get menu data
  const locale = useLocale();
  const menu = MenuData();
  const [menuData, setMenuData] = useState<any[]>(menu);

  useEffect(() => {
    setMenuData(menu);
  }, [locale]);

  // Attach scroll event for sticky navbar
  useEffect(() => {
    const handleStickyNavbar = () => {
      if (window.scrollY >= 80) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  useEffect(() => {
    setNavbarOpen(isNavbarOpen);
  }, [isNavbarOpen]);

  // submenu handler
  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: any) => {
    if (openIndex === index) {
      setOpenIndex(-1);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <nav
      id="navbarCollapse"
      className={`navbar border-body-color/50 dark:border-body-color/20 absolute right-0 z-30 w-[250px] rounded border-[.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:bg-transparent! lg:p-0 lg:opacity-100 dark:bg-gray-800 lg:dark:bg-transparent ${
        navbarOpen ? "visibility top-full opacity-100" : "invisible top-[120%] opacity-0"
      }`}
    >
      <ul className="block lg:ml-8 lg:flex lg:gap-x-8 xl:ml-14 xl:gap-x-12">
        {menuData.map((menuItem, index) => {
          if (menuItem.path && !menuItem.isLogedin) {
            return (
              <li key={index} className="group relative">
                {pathUrl !== "/" ? (
                  <Link
                    onClick={navbarToggleHandler}
                    scroll={false}
                    href={menuItem.path}
                    className={`ud-menu-scroll group-hover:text-primary dark:group-hover:text-primary flex py-4 text-black lg:inline-flex lg:px-0 lg:py-6 dark:text-white ${
                      pathUrl === menuItem.path && "text-primary"
                    }`}
                  >
                    {menuItem.title}

                    <span className="pl-1 text-transparent">
                      <svg
                        className={
                          openIndex === index
                            ? `duration-300 lg:group-hover:rotate-180`
                            : `rotate-180 duration-300 lg:group-hover:rotate-0`
                        }
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <Link
                    scroll={false}
                    href={menuItem.path}
                    className={`ud-menu-scroll flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                      sticky
                        ? "group-hover:text-primary dark:group-hover:text-primary text-black dark:text-white"
                        : "lg:text-black dark:text-white"
                    } ${pathUrl === menuItem.path && sticky && "text-primary!"}`}
                  >
                    {menuItem.title}

                    <span className="pl-1 text-transparent">
                      <svg
                        className={
                          openIndex === index
                            ? `duration-300 lg:group-hover:rotate-180`
                            : `rotate-180 duration-300 lg:group-hover:rotate-0`
                        }
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </Link>
                )}
              </li>
            );
          } else if (
            menuItem.path &&
            menuItem.isLogedin &&
            !isPending &&
            user &&
            menuItem.userRoles?.includes(user.role!)
          ) {
            return (
              <li key={index} className="group relative">
                {pathUrl !== "/" ? (
                  <Link
                    onClick={navbarToggleHandler}
                    scroll={false}
                    href={menuItem.path}
                    className={`ud-menu-scroll group-hover:text-primary dark:group-hover:text-primary flex py-4 text-black lg:inline-flex lg:px-0 lg:py-6 dark:text-white ${
                      pathUrl === menuItem.path && "text-primary"
                    }`}
                  >
                    {menuItem.title}

                    <span className="pl-1">
                      <svg
                        className={
                          openIndex === index
                            ? `duration-300 lg:group-hover:rotate-180`
                            : `rotate-180 duration-300 lg:group-hover:rotate-0`
                        }
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <Link
                    scroll={false}
                    href={menuItem.path}
                    className={`ud-menu-scroll flex py-2 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                      sticky
                        ? "group-hover:text-primary dark:group-hover:text-primary text-black dark:text-white"
                        : "lg:text-black dark:text-white"
                    } ${pathUrl === menuItem.path && sticky && "text-primary!"}`}
                  >
                    {menuItem.title}
                  </Link>
                )}
              </li>
            );
          } else if (!menuItem.path && menuItem.submenu && !menuItem.isLogedin) {
            return (
              <li className="submenu-item group relative" key={index}>
                {pathUrl !== "/" ? (
                  <button
                    onClick={() => handleSubmenu(index)}
                    className={`ud-menu-scroll group-hover:text-primary dark:group-hover:text-primary flex items-center justify-between py-4 text-base text-black lg:inline-flex lg:px-0 lg:py-6 dark:text-white`}
                  >
                    {menuItem.title}

                    <span className="pl-1">
                      <svg
                        className={
                          openIndex === index
                            ? `duration-300 lg:group-hover:rotate-180`
                            : `rotate-180 duration-300 lg:group-hover:rotate-0`
                        }
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmenu(index)}
                    className={`ud-menu-scroll flex items-center justify-between py-4 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                      sticky
                        ? "group-hover:text-primary dark:group-hover:text-primary text-black dark:text-white"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {menuItem.title}

                    <span className="pl-1">
                      <svg
                        className={
                          openIndex === index
                            ? `duration-300 lg:group-hover:rotate-180`
                            : `rotate-180 duration-300 lg:group-hover:rotate-0`
                        }
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </button>
                )}

                <div
                  className={`submenu relative top-full left-0 w-[250px] rounded-sm bg-white px-4 transition-[top] duration-300 group-hover:opacity-100 lg:absolute lg:top-[110%] lg:block lg:p-4 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full dark:bg-gray-800 ${
                    openIndex === index ? "-left-[25px]!" : "hidden lg:invisible lg:opacity-0"
                  }`}
                >
                  {menuItem.submenu.map((submenuItem: any, i: any) => {
                    if (isEmpty(submenuItem.userRoles))
                      return (
                        <Link
                          href={submenuItem.path}
                          key={i}
                          className={`block rounded px-4 py-[10px] text-sm lg:p-4 ${
                            pathUrl === submenuItem.path
                              ? "text-primary"
                              : "hover:text-primary dark:hover:text-primary dark:text-gray-200"
                          }`}
                        >
                          {submenuItem.title}
                        </Link>
                      );
                  })}
                </div>
              </li>
            );
          } else if (
            !menuItem.path &&
            menuItem.submenu &&
            menuItem.isLogedin &&
            !isPending &&
            user &&
            menuItem.userRoles?.includes(user.role!)
          ) {
            return (
              <li className="submenu-item group relative" key={index}>
                {pathUrl !== "/" ? (
                  <button
                    onClick={() => handleSubmenu(index)}
                    className={`ud-menu-scroll group-hover:text-primary dark:group-hover:text-primary flex items-center justify-between py-4 text-base text-black lg:inline-flex lg:px-0 lg:py-6 dark:text-white`}
                  >
                    {menuItem.title}

                    <span className="pl-1">
                      <svg
                        className={
                          openIndex === index
                            ? `duration-300 lg:group-hover:rotate-180`
                            : `rotate-180 duration-300 lg:group-hover:rotate-0`
                        }
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmenu(index)}
                    className={`ud-menu-scroll flex items-center justify-between py-4 text-base lg:inline-flex lg:px-0 lg:py-6 ${
                      sticky
                        ? "group-hover:text-primary dark:group-hover:text-primary text-black dark:text-white"
                        : "text-black dark:text-white"
                    }`}
                  >
                    {menuItem.title}

                    <span className="pl-1">
                      <svg
                        className={
                          openIndex === index
                            ? `duration-300 lg:group-hover:rotate-180`
                            : `rotate-180 duration-300 lg:group-hover:rotate-0`
                        }
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00039 11.9C7.85039 11.9 7.72539 11.85 7.60039 11.75L1.85039 6.10005C1.62539 5.87505 1.62539 5.52505 1.85039 5.30005C2.07539 5.07505 2.42539 5.07505 2.65039 5.30005L8.00039 10.525L13.3504 5.25005C13.5754 5.02505 13.9254 5.02505 14.1504 5.25005C14.3754 5.47505 14.3754 5.82505 14.1504 6.05005L8.40039 11.7C8.27539 11.825 8.15039 11.9 8.00039 11.9Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </button>
                )}

                <div
                  className={`submenu relative top-full left-0 w-[250px] rounded-sm bg-white px-4 transition-[top] duration-300 group-hover:opacity-100 lg:absolute lg:top-[110%] lg:block lg:p-4 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full dark:bg-gray-800 ${
                    openIndex === index ? "-left-[25px]!" : "hidden lg:invisible lg:opacity-0"
                  }`}
                >
                  {menuItem.submenu.map((submenuItem: any, i: any) => {
                    if (submenuItem.userRoles?.includes(user.role!) || isEmpty(submenuItem.userRoles))
                      return (
                        <Link
                          href={submenuItem.path}
                          key={i}
                          className={`block rounded px-4 py-[10px] text-sm lg:p-4 ${
                            pathUrl === submenuItem.path
                              ? "text-primary"
                              : "hover:text-primary dark:hover:text-primary dark:text-gray-200"
                          }`}
                        >
                          {submenuItem.title}
                        </Link>
                      );
                  })}
                </div>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>
    </nav>
  );
}

export default HeaderMenu;
