const USPS_API = process.env.USPS_API_URL || "https://api.usps.com"

function getAuth(): Record<string, string> {
  const apiKey = process.env.USPS_API_KEY
  const username = process.env.USPS_USERNAME
  const password = process.env.USPS_PASSWORD

  if (apiKey) return { Authorization: `Bearer ${apiKey}` }
  if (username && password) {
    return { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}` }
  }
  return {}
}

async function uspsFetch(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${USPS_API}${path}`, {
    ...init,
    headers: { ...getAuth(), "Content-Type": "application/json", ...(init?.headers || {}) },
  })
  if (!res.ok) throw new Error(`USPS API error: ${res.status}`)
  return res.json()
}

export async function validateAddress(address: {
  street: string
  city: string
  state: string
  zip: string
}): Promise<any> {
  return uspsFetch("/addresses/v3/validate", {
    method: "POST",
    body: JSON.stringify(address),
  })
}

export async function trackPackage(trackingNumber: string): Promise<any> {
  return uspsFetch(`/tracking/v3/${encodeURIComponent(trackingNumber)}`)
}

export async function trackMultiple(trackingNumbers: string[]): Promise<any> {
  return uspsFetch("/tracking/v3/batch", {
    method: "POST",
    body: JSON.stringify({ trackingNumbers }),
  })
}

export async function getRates(data: {
  origin: string
  destination: string
  weight: number
  service?: string
}): Promise<any> {
  return uspsFetch("/prices/v3/base-rates/search", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function createLabel(data: {
  from: { street: string; city: string; state: string; zip: string }
  to: { street: string; city: string; state: string; zip: string }
  weight: number
  service: string
}): Promise<any> {
  return uspsFetch("/labels/v3/label", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getZipCode(address: {
  street: string
  city: string
  state: string
}): Promise<any> {
  return uspsFetch(`/zipcodes/v3/city-state`, {
    method: "POST",
    body: JSON.stringify(address),
  })
}

export async function getAddressInfo(zipCode: string): Promise<any> {
  return uspsFetch(`/zipcodes/v3/zip/${encodeURIComponent(zipCode)}`)
}
