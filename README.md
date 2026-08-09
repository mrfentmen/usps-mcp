# USPS MCP

MCP server for USPS shipping, tracking, and address validation.

## Tools

- `validate_address` - Validate a USPS address
- `track_package` - Track a USPS package
- `track_multiple` - Track multiple packages
- `get_rates` - Get shipping rates
- `create_label` - Create shipping label
- `get_zip_code` - Look up ZIP by city/state
- `get_address_info` - Get info from ZIP code

## Install

```bash
npx usps-mcp
```

## Env Vars

- `USPS_API_KEY` - USPS API key (Bearer token)
- `USPS_USERNAME` / `USPS_PASSWORD` - Basic auth fallback
