'use client'

import Link from 'next/link'
import { useContext, useEffect } from 'react'

import { AuthContext } from '@/components/authContext'
import { TailwindElementsContext } from '@/components/teContext'

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext)!
  const { initElements } = useContext(TailwindElementsContext)

  const { state, checkAuth } = useContext(AuthContext)!

  initElements(({ Collapse, Dropdown }: any) => ({ Collapse, Dropdown }))

  useEffect(() => {
    if (!state.checkedAuth) {
      checkAuth().finally(() => {
        console.debug('App finished checking auth.')
      })
    }
  }, [state, checkAuth])

  async function handleLogout(): Promise<void> {
    await logout()
  }

  return (
    <div className="container mx-auto">
      <nav
        className="relative flex w-full flex-nowrap items-center justify-between bg-[#eeeeee] py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:flex-wrap lg:justify-start lg:py-4"
        data-te-navbar-ref
      >
        <div className="flex w-full flex-wrap items-center justify-between px-3">
          <div className="mt-2 ml-2">
            <Link
              className="text-xl text-neutral-800 dark:text-neutral-200"
              href="/"
            >
              DEMO
            </Link>
          </div>
          {/* Hamburger button for mobile view */}
          <div className="lg:hidden">
            <button
              className="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200"
              type="button"
              data-te-collapse-init
              data-te-target="#navbarSupportedContent2"
              aria-controls="navbarSupportedContent2"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              {/* Hamburger icon */}
              <span className="[&>svg]:w-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Collapsible navbar container */}
          <div
            className="!visible mt-2 hidden flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
            id="navbarSupportedContent2"
            data-te-collapse-item
          >
            {/* Left links */}
            <ul
              className="list-style-none mr-auto flex flex-col pl-0 lg:mt-1 lg:flex-row"
              data-te-navbar-nav-ref
            >
              <li
                className="my-4 pl-2 lg:my-0 lg:pl-2 lg:pr-1"
                data-te-nav-item-ref
              >
                {/* Home link */}
                <Link
                  className="active disabled:text-black/30 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
                  aria-current="page"
                  href="/"
                  data-te-nav-link-ref
                >
                  Home
                </Link>
              </li>

              <li
                className={
                  'my-4 pl-2 lg:my-0 lg:pl-2 lg:pr-1 ' +
                  (isLoggedIn() ? '' : 'hidden')
                }
                data-te-nav-item-ref
              >
                <div
                  className="active disabled:text-black/30 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
                  data-te-dropdown-ref
                >
                  <a
                    className="active flex items-center text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
                    href="#"
                    type="button"
                    id="dropdownMenuButton2"
                    data-te-dropdown-toggle-ref
                    aria-expanded="false"
                  >
                    Administration
                    <span className="ml-2 w-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                  </a>
                  <ul
                    className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
                    aria-labelledby="dropdownMenuButton2"
                    data-te-dropdown-menu-ref
                  >
                    <li>
                      <Link
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                        aria-current="page"
                        href="/admin"
                        data-te-dropdown-item-ref
                      >
                        Admin Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                        aria-current="page"
                        href="/admin/permissions"
                        data-te-dropdown-item-ref
                      >
                        Permissions
                      </Link>
                    </li>{' '}
                    <li>
                      <Link
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                        aria-current="page"
                        href="/admin/roles"
                        data-te-dropdown-item-ref
                      >
                        Roles
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                        aria-current="page"
                        href="/admin/users"
                        data-te-dropdown-item-ref
                      >
                        Users
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>

            <div className="relative flex items-center">
              {!isLoggedIn() && <Link href="/login">Login</Link>}
              {isLoggedIn() && <button onClick={handleLogout}>Logout</button>}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
