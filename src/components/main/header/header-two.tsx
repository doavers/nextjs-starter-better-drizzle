"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { UserAvatar } from "@/components/common/user-avatar";
import { AUTH_CONFIG } from "@/config/auth-config";
import { useSession } from "@/lib/auth-client";

import HeaderMenu from "./header-menu";

const Header = () => {
  const pathUrl = usePathname();
  const isLoginPage: boolean = pathUrl === AUTH_CONFIG.loginPage;

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const t = useTranslations("auth");

  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    console.log("navbarToggleHandler H2 called", !navbarOpen);
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(() => {
    // Check if we're on the client side before accessing window
    if (typeof window !== "undefined") {
      return window.scrollY >= 80;
    }
    return false;
  });

  useEffect(() => {
    const handleStickyNavbar = () => setSticky(window.scrollY >= 80);

    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const { theme, setTheme } = useTheme();

  if (isLoginPage) return null;

  return (
    <header
      className={`top-0 left-0 z-40 flex w-full items-center ${
        sticky
          ? "shadow-nav border-stroke dark:border-dark-3/20 fixed z-999 border-b bg-white/80 backdrop-blur-[5px] dark:bg-black/10"
          : "absolute bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-52 max-w-full px-4">
            <Link href="/" className={`navbar-logo block w-full ${sticky ? "py-3" : "py-5"} `}>
              {pathUrl !== "/" ? (
                <>
                  <Image
                    src={`/images/logo/logo.png`}
                    alt="logo"
                    width={240}
                    height={30}
                    className="header-logo w-full dark:hidden"
                  />
                  <Image
                    src={`/images/logo/logo-reverse.png`}
                    alt="logo"
                    width={240}
                    height={30}
                    className="header-logo hidden w-full dark:block"
                  />
                </>
              ) : (
                <>
                  <Image
                    src={`${sticky ? "/images/logo/logo.png" : "/images/logo/logo.png"}`}
                    alt="logo"
                    width={140}
                    height={30}
                    className="header-logo w-full dark:hidden"
                  />
                  <Image
                    src={"/images/logo/logo-reverse.png"}
                    alt="logo"
                    width={140}
                    height={30}
                    className="header-logo hidden w-full dark:block"
                  />
                </>
              )}
            </Link>
          </div>
          <div className="flex items-center px-4 sm:w-full sm:justify-between">
            <div>
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="ring-primary absolute top-1/2 right-4 block -translate-y-1/2 rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? "top-[7px] rotate-45" : " "
                  } ${pathUrl !== "/" && "bg-black! dark:bg-white!"} ${
                    pathUrl === "/" && sticky ? "bg-black dark:bg-white" : "bg-black dark:bg-white"
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? "opacity-0" : " "
                  } ${pathUrl !== "/" && "bg-black! dark:bg-white!"} ${
                    pathUrl === "/" && sticky ? "bg-black dark:bg-white" : "bg-black dark:bg-white"
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] transition-all duration-300 ${
                    navbarOpen ? "top-[-8px] -rotate-45" : " "
                  } ${pathUrl !== "/" && "bg-black! dark:bg-white!"} ${
                    pathUrl === "/" && sticky ? "bg-black dark:bg-white" : "bg-black dark:bg-white"
                  }`}
                />
              </button>
              <HeaderMenu isNavbarOpen={navbarOpen} />
            </div>
            <div className="flex items-center justify-end pr-16 lg:pr-0">
              {/* theme toggler */}
              <button
                aria-label="theme toggler"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden h-8 w-8 items-center justify-center duration-300 sm:flex dark:text-white"
              >
                <span>
                  <svg viewBox="0 0 16 16" className="hidden h-[22px] w-[22px] fill-current dark:block">
                    <path d="M4.50663 3.2267L3.30663 2.03337L2.36663 2.97337L3.55996 4.1667L4.50663 3.2267ZM2.66663 7.00003H0.666626V8.33337H2.66663V7.00003ZM8.66663 0.366699H7.33329V2.33337H8.66663V0.366699V0.366699ZM13.6333 2.97337L12.6933 2.03337L11.5 3.2267L12.44 4.1667L13.6333 2.97337ZM11.4933 12.1067L12.6866 13.3067L13.6266 12.3667L12.4266 11.1734L11.4933 12.1067ZM13.3333 7.00003V8.33337H15.3333V7.00003H13.3333ZM7.99996 3.6667C5.79329 3.6667 3.99996 5.46003 3.99996 7.6667C3.99996 9.87337 5.79329 11.6667 7.99996 11.6667C10.2066 11.6667 12 9.87337 12 7.6667C12 5.46003 10.2066 3.6667 7.99996 3.6667ZM7.33329 14.9667H8.66663V13H7.33329V14.9667ZM2.36663 12.36L3.30663 13.3L4.49996 12.1L3.55996 11.16L2.36663 12.36Z" />
                  </svg>

                  <svg
                    viewBox="0 0 23 23"
                    className={`h-[30px] w-[30px] fill-current text-black dark:hidden ${
                      !sticky && pathUrl === "/" && "text-black"
                    }`}
                  >
                    <g clipPath="url(#clip0_40_125)">
                      <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
                    </g>
                  </svg>
                </span>
              </button>

              <LocaleSwitcher className="hidden sm:flex" />

              {!isPending && session?.user && user && <UserAvatar />}

              {!isPending && !session && (
                <>
                  {pathUrl !== "/" ? (
                    <>
                      <Link
                        href={AUTH_CONFIG.loginPage}
                        className="px-2 py-3 text-base font-medium text-black hover:opacity-70 sm:px-7 dark:text-white"
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href={AUTH_CONFIG.registerPage}
                        className="bg-primary hover:bg-primary/90 hidden rounded-lg px-6 py-3 text-base font-medium text-white duration-300 ease-in-out sm:block dark:bg-white/90 dark:text-black dark:hover:bg-white/20 dark:hover:text-white"
                      >
                        {t("register")}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href={AUTH_CONFIG.loginPage}
                        className={`px-2 py-3 text-base font-medium hover:opacity-70 sm:px-7 ${
                          sticky ? "text-black dark:text-white" : "text-black dark:text-white"
                        }`}
                      >
                        {t("login")}
                      </Link>
                      <Link
                        href={AUTH_CONFIG.registerPage}
                        className={`hidden rounded-lg px-6 py-3 text-base font-medium duration-300 ease-in-out sm:block ${
                          sticky
                            ? "bg-primary hover:bg-primary/90 text-white dark:bg-white/90 dark:text-black dark:hover:bg-white/20 dark:hover:text-white"
                            : "bg-secondary hover:bg-primary/90 text-black hover:text-white dark:bg-white/90 dark:text-black dark:hover:bg-white/20"
                        }`}
                      >
                        {t("register")}
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
