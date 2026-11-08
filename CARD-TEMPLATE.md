# Heirloom rep contact cards

The approved "Heirloom look" is the `/start/contact/` design (reference: Aidan's card at `/start/contact/`).
All rep cards must use it. Do NOT use the retired flat `/kit/<name>.html` design.

Master template: `contact-card-template.html` (repo root), generated from `start/contact/nick/index.html`.

## Adding a new rep
1. Copy `contact-card-template.html` to `start/contact/<first>/index.html` and replace placeholders:
   - `{{FULL_NAME}}` display name; `{{FIRST}}` / `{{LAST}}` (and `_LOWER` variants for the vcf filename)
   - `{{TEL_E164}}` like `+14243033788`; `{{TEL_PRETTY}}` like `424-303-3788`
   - `{{EMAIL}}` their @heirloomroofing.com address
   - `{{ROLE_PREFIX}}` e.g. `Co-owner - ` or empty for reps; `{{TITLE_LINE}}` / `{{WORK_TEL_LINE}}` are optional VCF lines (full lines incl. trailing newline, or empty)
2. Replace `kit/<first>.html` with the redirect stub (copy `kit/nick.html`, swap the slug) so old links keep working.
3. Add a directory row in `start/contacts/heirloom/index.html` linking `/start/contact/<first>/` (same `a.person` markup as the other rows; sub line `Heirloom Roofing` unless they have a title).
4. Deploy, then verify the live page and one redirect visually.

Current cards: aidan `/start/contact/` (claim approval access code - do not port), nick, erik, austin, ben, carson, jayden, josh, kelsey, zach, jerit at `/start/contact/<first>/`. Jerit's vCard includes his PHOTO - preserve it on rebuilds.
