// @ts-nocheck
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import * as USPS from "./usps.js"

export function createServer(): McpServer {
  const server = new McpServer({ name: "usps-mcp", version: "1.0.0" })

  server.tool(
    "validate_address",
    "Validate a USPS address.",
    {
      street: z.string().describe("Street address"),
      city: z.string().describe("City"),
      state: z.string().describe("State"),
      zip: z.string().describe("ZIP code"),
    },
    async (args: any) => {
      try {
        const result = await USPS.validateAddress(args)
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }] }
      }
    },
  )

  server.tool(
    "track_package",
    "Track a USPS package.",
    {
      trackingNumber: z.string().describe("USPS tracking number"),
    },
    async (args: any) => {
      try {
        const result = await USPS.trackPackage(args.trackingNumber)
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }] }
      }
    },
  )

  server.tool(
    "track_multiple",
    "Track multiple USPS packages.",
    {
      trackingNumbers: z.string().describe("Comma-separated tracking numbers"),
    },
    async (args: any) => {
      try {
        const numbers = args.trackingNumbers.split(",").map((s: string) => s.trim())
        const result = await USPS.trackMultiple(numbers)
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }] }
      }
    },
  )

  server.tool(
    "get_rates",
    "Get USPS shipping rates.",
    {
      origin: z.string().describe("Origin ZIP code"),
      destination: z.string().describe("Destination ZIP code"),
      weight: z.number().describe("Weight in ounces"),
      service: z.string().optional().describe("Service type (optional)"),
    },
    async (args: any) => {
      try {
        const result = await USPS.getRates({
          origin: args.origin,
          destination: args.destination,
          weight: args.weight,
          service: args.service,
        })
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }] }
      }
    },
  )

  server.tool(
    "create_label",
    "Create a USPS shipping label.",
    {
      from: z.string().describe("Sender address as JSON: {street,city,state,zip}"),
      to: z.string().describe("Recipient address as JSON: {street,city,state,zip}"),
      weight: z.number().describe("Weight in ounces"),
      service: z.string().describe("Service type (e.g., FirstClass, Priority)"),
    },
    async (args: any) => {
      try {
        const from = JSON.parse(args.from)
        const to = JSON.parse(args.to)
        const result = await USPS.createLabel({ from, to, weight: args.weight, service: args.service })
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }] }
      }
    },
  )

  server.tool(
    "get_zip_code",
    "Look up ZIP code by city/state.",
    {
      street: z.string().describe("Street address"),
      city: z.string().describe("City"),
      state: z.string().describe("State"),
    },
    async (args: any) => {
      try {
        const result = await USPS.getZipCode(args)
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }] }
      }
    },
  )

  server.tool(
    "get_address_info",
    "Get city/state info from ZIP code.",
    {
      zipCode: z.string().describe("ZIP code"),
    },
    async (args: any) => {
      try {
        const result = await USPS.getAddressInfo(args.zipCode)
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }
      } catch (err) {
        return { content: [{ type: "text", text: `Error: ${(err as Error).message}` }] }
      }
    },
  )

  return server
}
