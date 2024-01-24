'use client'

import { useEffect, useState } from 'react'

import useRequireAuth from '@/components/useRequireAuth'
import { useUsersApi } from '@/components/usersApi'

export default function UsersPage() {
  const { authContext } = useRequireAuth()

  const [users, setUsers] = useState<Array<any> | null>()
  const { getUsers, deleteUser } = useUsersApi()

  useEffect(() => {
    if (authContext.isLoggedIn()) {
      loadUsers()
    }
  }, [authContext])

  async function loadUsers() {
    return getUsers()
      .then((result) => setUsers(result.data?.users))
      .catch(() => setUsers(null))
  }

  function handleDeleteUser(id: string): void {
    deleteUser(id).then((result) => {
      console.debug(result)
      loadUsers()
    })
  }

  return (
    <main className="flex flex-col items-center justify-between p-4">
      <div>
        <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">
          Users
        </h1>

        {users && (
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          #
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Username
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((user) => (
                        <tr
                          className="border-b dark:border-neutral-500"
                          key={user.id}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {user.id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.username}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              type="button"
                              className="inline-block rounded bg-danger px-3 pb-1 pt-1.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
