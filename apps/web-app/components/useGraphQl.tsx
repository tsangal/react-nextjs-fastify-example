import { useContext } from 'react'

import { AuthContext } from './authContext'
import { RuntimeConfigContext } from '@/components/runtimeConfig'

export default function useGraphQl() {
  const { apiBaseUrl } = useContext(RuntimeConfigContext)!
  const { state: authState } = useContext(AuthContext)!

  async function postGraphQlQuery(body: GraphQlBody): Promise<GraphQlResult> {
    const res = await fetch(`${apiBaseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authState.authToken,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error(res)
    }
    const data = await res.json()
    return data
  }

  return {
    postGraphQlQuery,
  }
}

export interface GraphQlBody {
  query: string
  operationName?: string
  variables?: Record<string, any>
}

export interface GraphQlResult {
  data: any
  errors?: Array<any>
}
