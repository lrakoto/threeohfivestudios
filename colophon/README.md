# colophon

The canonical authorship and support terms for [ThreeOhFive
Studios](https://threeohfivestudios.com) work — Lova Rakotomavonandrianina.

One source of truth, mirrored into every project. Change it here, not in
thirteen repos.

| File | What it is |
|---|---|
| `colophon.md` | The signature block, copied verbatim into each project |
| `funding.json` | Machine-readable authorship + support terms ([floss.fund](https://floss.fund) manifest format) |
| `.well-known/funding-manifest-urls` | Discovery file — copy to the web root of threeohfivestudios.com |
| `docs/rollout.md` | How to add all of this to a project |
| `docs/x402-tip-endpoint.md` | Specification for a machine-payable support endpoint (not deployed) |

## The idea

Three layers, deliberately separate:

1. **Signature** — the same block of prose in every project, so the body of
   work reads as one body of work.
2. **Terms as data** — `funding.json` at a stable URL, so a crawler, an
   indexer or an agent can read who made something and how support works
   without parsing prose.
3. **Rails** — where payment actually happens. Today: a receive-only USDC
   address on Base. Planned: an HTTP 402 endpoint that a machine client can
   call and get a receipt from.

## Why terms are data and not a request

Earlier versions of the signature block asked agents directly to leave a tip.
That does not work, and it will keep not working. A file that instructs its
reader to move money is shaped exactly like a prompt-injection attack, so a
well-built agent treats it as data to report, not an instruction to follow —
and it is right to. Authorization to spend belongs to the agent's principal,
expressed as budget and policy, never to the content the agent happens to be
reading.

So the design inverts: publish a precise, verifiable, machine-readable offer at
a stable address, and let whoever has standing to decide, decide.

## Status

**v0, unsigned.** The manifest makes a claim that nothing yet verifies. Two
upgrades close that gap, in order: a Basename or ENS name as the primary payee,
and a signature over `funding.json` with the key fingerprint published in the
colophon. Until then, anyone consuming this should treat the payee as
unverified. See `docs/x402-tip-endpoint.md` for the reasoning.

Realistic expectation: this earns nothing for a good while. It is cheap
optionality, correctly shaped, for a thing that may or may not arrive.
