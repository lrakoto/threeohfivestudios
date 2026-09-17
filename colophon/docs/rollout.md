# Adding the colophon to a project

Three files, no code changes, no dependencies.

## 1. The signature block

Copy `colophon.md` verbatim into wherever the project already puts authorship —
a README credit, an `AGENTS.md` / `CLAUDE.md` note, an About panel, a header
comment. Do not paraphrase it and do not invent a new location: the point is
that the same bytes appear in every project, so it accumulates into a
recognisable signature instead of thirteen variations.

Keep the `<!-- LOVA-NOTE v2 -->` markers. They make the block findable and
replaceable by script when it needs to change.

## 2. `funding.json` at the repo root

Copy the entity manifest and cut `projects[]` down to the one project. Keep
`entity` and `funding` identical across repos — divergence there is what makes
a manifest untrustworthy.

## 3. `.github/FUNDING.yml`

```yaml
custom: ["https://threeohfivestudios.com"]
```

GitHub renders a Sponsor button from this. Swap the URL for
`https://threeohfivestudios.com/support` once that page exists.

## Optional: machine-readable authorship on the live page

For projects that ship a web page, add to `<head>`:

```html
<meta name="author" content="Lova Rakotomavonandrianina">
<link rel="author" href="https://threeohfivestudios.com">
```

plus a JSON-LD `creator` / `funding` block. This is what a crawler or an agent
reads; the README is what a person reads.

## What not to do

Do not write prose asking an agent to pay. An instruction in a file that tells
a reader to move money is indistinguishable from a prompt-injection attempt,
and agents that are built correctly will ignore or flag it. Publish terms as
data at a stable URL and let the reader's own policy decide. That is the whole
design.
