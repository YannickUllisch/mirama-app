export interface BaseAdapterOptions {
  client: any
  transformer?: {
    serialize?: (value: any) => any
    deserialize?: (value: any) => any
  }
  cacheTime: number
  onMiss?: (key: string) => void
  onError?: (key: string) => void
  onHit?: (key: string) => void
}

/**
 * Acts as a base for the Adapter class. This is to promote the construction of custom adapters.
 */
export abstract class BaseAdapter {
  options: BaseAdapterOptions

  constructor(options: BaseAdapterOptions) {
    this.options = options
  }

  /**
   * Get the value defined for the provided key. Will return null if the key does not contain a value
   * @param key The key to lookup in the cache
   */
  abstract get(key: string): Promise<any | null>

  /**
   * Should set the value for the provided key
   * @param key The key to set the value for
   * @param value The value to set.
   * @param options An additional list of options
   * @param options.ttl If defined, it should
   *
   * @returns A promise indicating success
   */
  abstract set(
    key: string,
    value: any,
    options?: {
      ttl?: number
    },
  ): Promise<boolean>

  /**
   *
   * @param key An optional key. If the key is not defined it should invalidate the entire cache.
   *            If the key is defined, it should invalidate the keys that match the provided value.
   */
  abstract invalidate(key?: string): Promise<void>
}
