const hashString = (str: string) => {
  let hash = 0
  let i: number
  let chr: number
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

// We generate a Unique Task ID given the projects name and a unique task uuid.
export const generateTaskId = (name: string, taskUuid: string) => {
  // We generate the Prefix based on the given name.
  // Prefix is currently set to length 3.
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const prefix = `${normalized.slice(0, 2)}${normalized.slice(
    -1,
  )}`.toUpperCase()

  // And then generate the suffix based on the given string.
  // The output will still be unique due to the UUID, the suffix is based on.
  // Suffix is currently set to length 4.
  const hash = Math.abs(hashString(taskUuid)).toString().slice(0, 4)
  const suffix = hash.padStart(4, '0')

  // We return our unique Task ID, consisting of prefix and suffix.
  return `${prefix}${suffix}`
}
