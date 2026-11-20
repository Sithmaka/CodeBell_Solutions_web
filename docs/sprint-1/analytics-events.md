# Analytics events

GA4 is disabled unless `VITE_GA4_MEASUREMENT_ID` is configured and the visitor grants analytics consent. Consent is stored locally; advertising storage/personalization remain denied. SPA page views are explicit and duplicate views of the same route are suppressed.

| Event | When | Parameters |
| --- | --- | --- |
| `page_view` | route change after consent | `page_path`, `page_title`, `brand` |
| `cta_click` | element with `data-cta-id` | `cta_id`, canonical `service`, `source_page`, `brand` |
| `service_interest` | CTA carries a service | above service context |
| `consultation_click` | consultation CTA | `cta_id`, `source_page` |
| `whatsapp_click` | WhatsApp link | `cta_id`, `source_page` |
| `lead_form_start` | first meaningful form edit | `source_page`, `cta_id` |
| `lead_form_submit` | valid submission begins | service/source/CTA |
| `lead_form_success` | backend persistence confirmed | service/source/CTA |
| `lead_form_error` | validation/backend error | bounded `error_type`, service/source |

Never send name, email, phone, company, free text, lead reference, Firebase UID, URL query strings containing user data, or any other personal/sensitive data to GA4. The adapter accepts scalar values and truncates strings, but call sites are still responsible for the semantic allowlist.

## QA

With a test GA4 property: deny consent and confirm no GA script/request; grant and confirm one script; navigate SPA routes and confirm one page view each; exercise CTA and form states; inspect DebugView payloads for event names and absence of PII. Production property validation is pending credentials/deployment.
