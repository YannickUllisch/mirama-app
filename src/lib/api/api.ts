import type { Prisma } from '@prisma/client'
import axios from 'axios'
import type { NextRequest } from 'next/server'

const envURL = {
  dev: 'http://localhost:3000',
  prod: 'https://mirama.vercel.app',
}

export const api = axios.create({
  baseURL: `${
    envURL[(process.env.NEXT_PUBLIC_ENV as 'dev' | 'prod') ?? 'dev']
  }/api/db/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getBody = async <T = any>(req: NextRequest) => {
  try {
    return (await req.json()) as Partial<T>
  } catch (err) {
    if (err instanceof SyntaxError) {
      // This is expected if the body does not exist or is invalid.
      return {} as Partial<T>
    }
    // Rethrow the error, to pass it on.
    throw new Error(err as any)
  }
}

type QueryParams = URLSearchParamsIterator<[string, string]>

type ResultObject = {
  [key: string]: any
}

const reconstructObject = (query: QueryParams): ResultObject => {
  const result: ResultObject = {}

  for (const [key, value] of query) {
    const keys = key.split(/[\[\]]+/).filter(Boolean)

    let current: ResultObject = result

    for (let i = 0; i < keys.length; i++) {
      const part = keys[i]

      // Check if it's the last part of the key
      if (i === keys.length - 1) {
        if (key.endsWith('[]')) {
          if (!current[part]) {
            current[part] = []
          }

          current[part].push(value)
        } else {
          // Assign the value, parsing to the correct type
          current[part] =
            value === 'true' ? true : value === 'false' ? false : value
        }
      } else {
        // Ensure the next level exists
        if (!current[part]) {
          current[part] = Number.isNaN(Number(keys[i + 1])) ? {} : []
        }
        current = current[part]
      }
    }
  }

  return result
}

export const getParams = <T = any>(req: NextRequest) => {
  const {
    nextUrl: { search },
  } = req
  const urlSearchParams = new URLSearchParams(search)
  const params = urlSearchParams.entries()

  return reconstructObject(params) as T
}

export type SelectKeys<T> = (keyof T)[]

export const createPrismaSelect = <T>(
  keys: SelectKeys<T>,
): Prisma.Prisma__Pick<T, (typeof keys)[number]> => {
  return keys.reduce(
    (acc, key) => {
      acc[key as string] = true
      return acc
    },
    {} as Record<string, true>,
  ) as Prisma.Prisma__Pick<T, (typeof keys)[number]>
}
