# Production readiness audit

Date: 26 October 2026. Project: Ostravia. Production: https://ostravia.vercel.app.

## Scope and verdict

Reviewed the React 19/Vite 6 static website, its five pre-rendered routes, GSAP/Lenis enhancement, email-client enquiry flows, native dialogs, testimonials, project filtering, release tooling, and Vercel configuration. There is no application backend, authentication, database, payment processing, or upload endpoint.

Technical changes are verified within the coverage below. **Real enquiry launch remains blocked by the unverified placeholder mailbox `hello@ostravia.com`.** No message delivery or business ownership has been established. Do not interpret a successful email-client handoff as delivery.

## Fixes

- Added complete, page-specific Open Graph and X metadata, 1200×630 JPEG cards, image alternative text/dimensions/type, PNG icons, and factual WebPage microdata. Metadata is present in pre-rendered HTML. Cards use the licensed Manrope build font; no ratings, addresses, social accounts, or organization claims were invented.
- Kept canonical URLs on the production origin, including local release builds. Vercel preview builds now receive noindex metadata and a disallowing robots.txt. Removed an obsolete catch-all SPA redirect that could mask missing pages on another host.
- Replaced the JavaScript-only FAQ with native, grouped details elements. It remains full width with a centered heading, keyboard operation, and progressive animation; it also works without JavaScript.
- Fixed mobile menu focus restoration and explicit dialog focus wrapping. Added visible focus treatment for summaries, selects, and text areas.
- Allowed enlarged hero text to wrap and the normal full-viewport hero to expand when needed. This prevents clipping under the tested text enlargement.
- Fixed project-card accessible names so they include the visible category text, supporting voice control. Lighthouse's numerical accessibility score did not expose this issue as a score reduction; the detailed findings did.
- Added an auto-rotation checkbox for the testimonial carousel, keeping the requested absence of a pause button. Rotation also pauses on hover/focus, stops when reduced motion is enabled, and does not resume merely because the pointer leaves a keyboard-focused carousel.
- Delayed optional animation downloads until interaction, deferred portrait downloads, reduced image sizes for smaller frames, and compressed the homepage mobile hero without changing its dimensions or framing. Content remains visible if optional animation or font requests fail.
- Clarified that forms compose email rather than send it. Added autocomplete, length limits, a direct email link, a no-JavaScript email action, and a status message that does not claim successful delivery.
- Replaced unclear and unsupported placeholder copy, removed the unverified registration symbol and external maker URL, and retained visible illustrative-story/project disclosures.
- Strengthened release checks for missing assets, unresolved bundler placeholders, social metadata, image dimensions, private files, source maps, and production canonicals. Added release-artifact checks to CI. Lighthouse recording failures are retried and never counted as passing measurements.
- Corrected Linux CI browser startup after the first remote Lighthouse step failed before loading any page. The compatibility flags apply only to the isolated audit browser; they do not weaken the application's security policy or visitors' browsers.

## Verification matrix

| Check                                      | Status                          | Evidence and limits                                                                                                                                                                                                                                                       |
| ------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build, lint, formatting, release artifacts | Passed                          | Production build, ESLint, Prettier, and release assertions. No public source maps or environment files.                                                                                                                                                                   |
| Chrome functional/accessibility suite      | Passed                          | 27 checks, including five routes at desktop/mobile widths, axe rules tagged WCAG 2 A/AA, 2.1 A/AA, and 2.2 AA, dialogs, validation, FAQ, filters, carousel, links, images, and error paths.                                                                               |
| Edge                                       | Passed                          | 12 route/interaction checks plus three targeted project-label/filter checks. This is additional Chromium coverage, not a different rendering engine.                                                                                                                      |
| Reflow and enlargement                     | Passed within tested scope      | All five pages at 320×568, 768×1024, and 844×390; normal route checks at 375×900 and 1280×900. Hero text was programmatically doubled at a mobile width. This does not replace native text-zoom testing in every browser.                                                 |
| Keyboard use                               | Passed within tested scope      | Scripted keyboard walkthroughs verify skip link, menu Escape/focus return, modal Tab wrapping/Escape/focus return, native validation, and FAQ operation.                                                                                                                  |
| No-JavaScript essentials                   | Passed                          | Pre-rendered content, mobile navigation, direct email links, and native FAQ. JavaScript-enhanced filters, dialogs, and carousel controls still require JavaScript.                                                                                                        |
| Optional script/font failures              | Passed                          | Browser requests deliberately blocked; content and contact dialog remain usable. Image references and decoded image availability checked separately.                                                                                                                      |
| Visual inspection                          | Passed within inspected views   | Desktop homepage, mobile services page, and generated social card inspected. Automated route screenshots retained in artifacts.                                                                                                                                           |
| SEO/social source checks                   | Passed                          | Titles, descriptions, canonicals, metadata, WebPage microdata, icons, sitemap/robots, public JPEGs, and one primary heading per route checked. Search-engine indexing and rich-result eligibility are not guaranteed.                                                     |
| Dependency vulnerabilities                 | Passed                          | npm audit returned zero known vulnerabilities across 472 installed dependency entries on the audit date. This is a database snapshot, not proof of absence of vulnerabilities.                                                                                            |
| Credential patterns/release exposure       | Passed within scan coverage     | No supported credential/private-key patterns or tracked environment files found. Static deployment contains no development sources, prompts, or secrets.                                                                                                                  |
| Security design                            | Passed within static-site scope | React text escaping, encoded email values, self-hosted assets, script CSP, framing restrictions, MIME protection, referrer/permissions policy, and HTTPS reviewed. Inline styles remain allowed for the existing animation/design system; inline scripts are not allowed. |
| App-side tracking                          | Passed within source review     | No analytics/advertising integration or application tracking cookies/storage found. Hosting and email providers may process data independently.                                                                                                                           |
| Authentication/payments/uploads/database   | Not applicable                  | These features do not exist in this project.                                                                                                                                                                                                                              |
| Screen reader and non-Chromium browsers    | Not tested                      | No screen reader, Safari, or supported Firefox automation was exercised. Physical iOS/Android devices and forced-colors mode were not tested.                                                                                                                             |
| Actual platform previews                   | Not tested                      | Metadata and images were checked directly. WhatsApp, Facebook, LinkedIn, and X caches/account-based preview tools were not exercised.                                                                                                                                     |
| Actual enquiry delivery                    | Not tested; launch blocker      | An owned mailbox and real delivery verification are required. No external message was sent during the audit.                                                                                                                                                              |
| Business/privacy/legal approvals           | Not tested                      | Confirm business identity, mailbox ownership, privacy information, and approved client material before accepting real enquiries. No legal policy was fabricated.                                                                                                          |
| Real-user Core Web Vitals                  | Not tested                      | No field dataset or analytics was available. Lighthouse is a lab test; TBT is not an actual-user INP measurement.                                                                                                                                                         |

## Measurements

Machine-readable before/after Lighthouse results and the measured score table accompany this report. Runs are single lab samples per route/mode and vary with machine load. Invalid browser/interstitial/trace recordings are excluded. Residual Lighthouse opportunities such as image delivery, initial CSS, cache policy, and JavaScript used by later interactions are not evidence of broken functionality.

All ten final runs met the configured score thresholds. Accessibility, best practices, and SEO each scored 100; CLS was zero in every run. Mobile lab LCP remains approximately 2.6–3.3 seconds, above the 2.5-second good threshold. No field Core Web Vitals pass is claimed.

| Mode    | Route     | Performance before | Performance after | Final LCP | Final TBT |
| ------- | --------- | ------------------ | ----------------- | --------- | --------- |
| mobile  | /         | 96                 | 96                | 2.71 s    | 19 ms     |
| mobile  | /features | 88                 | 91                | 3.32 s    | 95 ms     |
| mobile  | /about    | 62                 | 92                | 2.87 s    | 196 ms    |
| mobile  | /services | 81                 | 93                | 3.09 s    | 100 ms    |
| mobile  | /projects | 90                 | 96                | 2.57 s    | 66 ms     |
| desktop | /         | 98                 | 99                | 0.88 s    | 15 ms     |
| desktop | /features | 99                 | 99                | 0.88 s    | 6 ms      |
| desktop | /about    | 100                | 100               | 0.80 s    | 15 ms     |
| desktop | /services | 99                 | 99                | 0.83 s    | 3 ms      |
| desktop | /projects | 100                | 100               | 0.75 s    | 0 ms      |

Machine-readable results: [production-audit-metrics-2026-10-26.json](production-audit-metrics-2026-10-26.json). Raw Lighthouse HTML/JSON and browser reports are in the ignored local artifacts directory.

## Remaining actions by priority

1. **High, business-owned:** provide and verify an owned contact mailbox before real enquiries. The current address was deliberately invented in an earlier design iteration.
2. **Important, untested coverage:** complete a screen-reader walkthrough, Safari/Firefox and physical-device checks, native text zoom/forced-colors checks, and actual social-platform preview verification. Validate business-specific privacy requirements for the intended audience.
3. **Performance follow-up:** use measured lab LCP and real-user data when available to guide further work. Passing a Lighthouse score threshold does not establish that Core Web Vitals meet field thresholds.

The repository and production deployment can be rolled back to the previous verified commit/deployment. The live deployment verification record is retained with the local audit artifacts. Browser-delivered code and images remain inspectable; minification is not a secrecy or security boundary.
