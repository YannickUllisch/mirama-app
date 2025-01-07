import type { Redis, RedisKey } from 'ioredis'
import { BaseAdapter, type BaseAdapterOptions } from '.'

interface RedisAdapterOptions extends BaseAdapterOptions {
  client: Redis
}

export class RedisAdapter extends BaseAdapter {
  options: RedisAdapterOptions

  /**
   * Constructor for RedisAdapter
   * @param options The redis options required to create a RedisAdapter.
   */
  constructor(options: RedisAdapterOptions) {
    super(options)
    this.options = options
  }

  /**
   * Checks the cache to see if an element exists.
   * @param key The key to perform the lookup with
   * @returns Either the requested object or null if the value does not exist.
   */
  async get(key: string): Promise<any | null> {
    const { transformer, onMiss, onError, onHit, client } = this.options

    // Deserialize using the transformer, default transformer is JSON module.

    try {
      // Try to get the value from the redis cache
      const result = await client.get(key)

      if (!result) {
        // If it is not found, log the miss and return null
        onMiss?.(key.toString())
        return null
      }
      const parsedObject = JSON.parse(result)

      let deserializedObject = parsedObject
      if (transformer?.deserialize) {
        deserializedObject = transformer.deserialize(parsedObject)
      }

      // If it was hit, log it, and decode the result
      onHit?.(key.toString())
      return deserializedObject
    } catch (err) {
      console.error(err)
      onError?.(key)
    }
    return null
  }

  async set(
    key: string,
    value: any,
    options?: { ttl?: number },
  ): Promise<boolean> {
    const { transformer, onError, client, cacheTime } = this.options
    // Serialize using the transformer, default transformer is JSON module.
    let serializableObject = value
    if (transformer?.serialize) {
      serializableObject = transformer.serialize(value)
    }

    // Set the
    try {
      const result = await client.set(
        key,
        JSON.stringify(serializableObject),
        'EX',
        options?.ttl ?? cacheTime,
      )
      if (!result) {
        return false
      }

      return result === 'OK'
    } catch (err) {
      console.error(err)
      onError?.(key)
    }
    return false
  }
  async invalidate(key?: string): Promise<void> {
    const { client, onError } = this.options
    try {
      const deleteKeysByPattern = (key: string) => {
        return new Promise<number>((resolve, reject) => {
          const stream = client.scanStream({
            // only returns keys following the pattern of "key"
            match: key,
            // returns approximately 100 elements per call
            count: 100,
          })

          const keys: RedisKey[] = []
          stream.on('data', (resultKeys) => {
            // `resultKeys` is an array of strings representing key names
            for (let i = 0; i < resultKeys.length; i++) {
              keys.push(resultKeys[i])
            }
          })
          stream.on('error', (err) => {
            reject(err)
          })
          stream.on('end', async () => {
            if (keys.length > 0) {
              const num = await client.unlink(keys)
              resolve(num)
            } else {
              resolve(0)
            }
          })
        })
      }

      await deleteKeysByPattern(key ?? '*')
    } catch (err) {
      console.error(err)
      onError?.(key ?? 'all')
    }
  }
}
