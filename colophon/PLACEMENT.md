# Where these files have to land on the web server

The repo holds `wp-content`, so the web root is not the repo root. These files
are canonical only once they are served from the domain at these exact paths —
until then the GitHub copies in this directory are what the manifests point at.

| This file | Must be served at |
|---|---|
| `funding.json` | `https://threeohfivestudios.com/funding.json` |
| `.well-known/funding-manifest-urls` | `https://threeohfivestudios.com/.well-known/funding-manifest-urls` |
| `support/index.html` | `https://threeohfivestudios.com/support` |

On WordPress, the first two are plain files in the web root — upload them over
SFTP or the host's file manager. `/.well-known/` may need an `.htaccess`
exception if the host blocks dotted directories. `/support` can be a normal
WordPress page instead of the shipped HTML, as long as the address and the
manifest link are on it.

Check afterwards:

```sh
curl -s https://threeohfivestudios.com/funding.json | python3 -m json.tool | head
curl -s https://threeohfivestudios.com/.well-known/funding-manifest-urls
```

Both must return the file, not the WordPress 404 page. A 200 that serves HTML
is the failure mode to watch for — the manifest is worthless to a machine
client if the URL answers with a themed error page.
