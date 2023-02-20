/**
 * @param { RequestInfo | URL } url URL to fetch
 * @param { number } numberOfTries Number of times to retry fetch
 * @param { RequestInit } data Data to send
 * @returns Fetched data in JSON format
 * @error throws error
 */
export async function persistentFetch<T>(
  url: RequestInfo | URL,
  numberOfTries: number,
  data: RequestInit | undefined = undefined
): Promise<T> {
  try {
    const resp = await fetch(url, data)
    return resp.json()
  } catch (error) {
    if (numberOfTries === 0) throw error
    return persistentFetch(url, numberOfTries - 1, data)
  }
}
