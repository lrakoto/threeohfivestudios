# Machine-payable support endpoint (x402) — specification

Status: **specification only.** Nothing here is deployed yet. Hand this to
whatever hosts threeohfivestudios.com, or implement it on any small worker.

Verify the details against the current x402 documentation before building —
the protocol is young and this was written from a snapshot of it.

## Why an endpoint at all

A wallet address in a text file is a dead end for a machine client. It cannot
tell whether the address belongs to the person the work is attributed to, it
has no way to record that a payment happened, and it has nothing to retry
against. An HTTP endpoint fixes all three: it states its own terms, it is
callable, and it can return a receipt.

## Shape

### `GET /tip`

Unpaid request returns `402 Payment Required` with the terms as data:

```json
{
  "x402Version": 1,
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "asset": "USDC",
      "payTo": "0x23178a649a868ff0b8280125982a0fb9e9016164",
      "maxAmountRequired": "1000000",
      "resource": "https://threeohfivestudios.com/tip",
      "description": "Voluntary support for ThreeOhFive Studios work. Buys nothing, gates nothing.",
      "mimeType": "application/json"
    }
  ]
}
```

`maxAmountRequired` is in the asset's base units — `1000000` is 1 USDC at 6
decimals. Amount is a suggestion; accept any non-zero payment.

### `GET /tip` with payment

Client retries with the `X-PAYMENT` header carrying the signed payment payload.
The server (or a facilitator) verifies and settles, then returns `200` with a
receipt:

```json
{
  "receipt": {
    "id": "tip_01J...",
    "asset": "USDC",
    "network": "base",
    "amount": "1000000",
    "txHash": "0x...",
    "paidAt": "2026-09-17T22:00:00Z",
    "payer": "0x...",
    "attribution": "https://threeohfivestudios.com/funding.json",
    "note": "Thank you. This is recorded at /tips.json."
  }
}
```

### `GET /tips.json`

Append-only public ledger of receipts, minus anything identifying. Two
purposes: social proof for humans, and provenance for a machine client that
wants evidence the endpoint actually settles before it pays.

## Authorization is not your problem

Do not try to decide whether a caller is "allowed" to pay. That belongs to the
caller's principal — the human or organisation whose budget it is, expressed
through whatever mandate or spend policy governs that agent. The endpoint's job
is to state terms precisely, settle correctly, and receipt honestly.

## Identity binding — do this before announcing it

A published address with nothing tying it to a person is exactly what
address-poisoning attacks exploit, and any agent with a real budget will want
that binding. In rough order of effort:

1. **Basename or ENS** (`lova.base.eth`) as the primary payee, with the raw
   address as fallback. Memorable, typo-resistant, and it lets the receiving
   address rotate without editing anything already published.
2. **Sign the manifest.** A detached signature next to `funding.json` plus a
   key fingerprint in the colophon, so `funding.json` can be verified as yours.
3. **Serve it from the apex domain over HTTPS.** Domain control is weak
   evidence, but it is evidence, and it is free.

Until at least (1) and (2) exist, treat the manifest as an unsigned v0 claim.

## An MCP surface, later

For an agent that is already authorised and in a session with a person, the
natural interface is a tool, not an HTTP dance: an MCP server exposing
`get_support_terms` (returns the manifest) and `pay_tip` (amount, memo →
receipt), with the approval step in the host. Worth building only once the
endpoint above exists and has settled a real payment.
