import useGraphQLQuery from '@/components/useGraphQl'

export function useRolesApi() {
  const { postGraphQlQuery } = useGraphQLQuery()

  async function getRoles() {
    return postGraphQlQuery({
      query: `
        query {
          roles {
            id
            name
            description
            permissions {
              id
              name
              description
            }
            created_at
            updated_at
          }
        }
      `,
    })
  }

  async function deleteRole(id: string) {
    return postGraphQlQuery({
      query: `
        mutation DeleteRole($id: String!) {
          deleteRole(id: $id) 
        }
      `,
      variables: {
        id,
      },
    })
  }

  return {
    getRoles,
    deleteRole,
  }
}
