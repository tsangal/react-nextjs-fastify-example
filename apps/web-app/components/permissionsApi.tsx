import useGraphQLQuery from '@/components/useGraphQl'

export function usePermissionsApi() {
  const { postGraphQlQuery } = useGraphQLQuery()

  async function getPermissions() {
    return postGraphQlQuery({
      query: `
        query {
          permissions {
            id
            name
            description
            created_at
            updated_at
          }
        }
      `,
    })
  }

  async function deletePermission(id: string) {
    return postGraphQlQuery({
      query: `
        mutation DeletePermission($id: String!) {
          deletePermission(id: $id) 
        }
      `,
      variables: {
        id,
      },
    })
  }

  return {
    getPermissions,
    deletePermission,
  }
}
