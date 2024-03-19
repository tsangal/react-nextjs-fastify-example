'use client'

import { createContext, useEffect, useState } from 'react'

type TailwindElementsContext = {
  initElements: Function
}

type ImportElementsCallback = (tailwindElements: any) => object

function defaultFunction() {
  console.warn('TailwindElementsContext: using default function.')
}

export const TailwindElementsContext = createContext<TailwindElementsContext>({
  initElements: defaultFunction,
})

export function TailwindElementsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [tailwindElements, setTailwindElements] = useState<any>()

  useEffect(() => {
    const init = async () => {
      let teImport
      if (tailwindElements) {
        teImport = tailwindElements
      } else {
        console.debug('Importing tw-elements.')
        teImport = await import('tw-elements')
        setTailwindElements(teImport)
      }
    }
    init()
  })

  function initElements(importElementsFn: ImportElementsCallback): void {
    if (!tailwindElements) {
      console.debug('tw-elements not imported yet.')
      return
    } else {
      const elements = importElementsFn(tailwindElements)
      console.debug(
        'Initializing Tailwind Elements: ' + Object.keys(elements).join(', ')
      )
      tailwindElements.initTE(elements)
    }
  }

  const value = {
    initElements,
  }

  return (
    <TailwindElementsContext.Provider value={value}>
      {children}
    </TailwindElementsContext.Provider>
  )
}
