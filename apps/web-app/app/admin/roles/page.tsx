'use client'

import { useEffect, useState } from 'react'

import useRequireAuth from '@/components/useRequireAuth'
import { useRolesApi } from '@/components/rolesApi'

export default function RolesPage() {
  const { authContext } = useRequireAuth()

  const [roles, setRoles] = useState<Array<any> | null>()
  const { getRoles, deleteRole } = useRolesApi()

  useEffect(() => {
    if (authContext.isLoggedIn()) {
      loadRoles()
    }
  }, [authContext])

  async function loadRoles() {
    return getRoles()
      .then((result) => setRoles(result.data?.roles))
      .catch(() => setRoles(null))
  }

  function handleDeleteRole(id: string): void {
    deleteRole(id).then((result) => {
      console.debug(result)
      loadRoles()
    })
  }

  return (
    <main className="flex flex-col items-center justify-between p-4">
      <div>
        <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">
          Roles
        </h1>

        {roles && (
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
                          Name
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Permissions
                        </th>
                        <th scope="col" className="px-6 py-4">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles?.map((role) => (
                        <tr
                          className="border-b dark:border-neutral-500"
                          key={role.id}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {role.id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {role.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {role.description}
                          </td>
                          <td className="whitespace-wrap px-6 py-4">
                            {role.permissions
                              ?.map((permission: any) => permission.name)
                              .sort()
                              .join(', ')}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              type="button"
                              className="inline-block rounded bg-danger px-3 pb-1 pt-1.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                              onClick={() => handleDeleteRole(role.id)}
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
