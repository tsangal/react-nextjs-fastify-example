import useGraphQLQuery from '@/components/useGraphQl'

export function useUsersApi() {
  const { postGraphQlQuery } = useGraphQLQuery()

  async function getUsers() {
    return postGraphQlQuery({
      query: `
        query {
          users {
            id
            username
            name
            created_at
            updated_at
          }
        }
      `,
    })
  }

  async function deleteUser(id: string) {
    return postGraphQlQuery({
      query: `
        mutation DeleteUser($id: String!) {
          deleteUser(id: $id) 
        }
      `,
      variables: {
        id,
      },
    })
  }

  return {
    getUsers,
    deleteUser,
  }
}
