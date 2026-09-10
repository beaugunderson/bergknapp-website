# App-interest mailing lists

Research checked September 10, 2026. Recommendation only; no mailing service, DNS record, signup form, or subscriber list has been provisioned.

## Recommendation: listmonk

Use **listmonk** for list management, on the existing Coolify infrastructure if capacity permits, and an SMTP delivery provider rather than operating an outbound mail server.

- Free, open-source, self-hosted software; hosting, database maintenance, and delivery are separate costs.
- A binary/container plus PostgreSQL. Coolify has a listmonk service template.
- One subscriber record can belong to multiple app-interest lists.
- Public signup API accepts multiple list UUIDs; plain HTML forms can submit repeated `l` fields without exposing an administrative API key. The Netlify site can stay static.
- Lists can use double opt-in. Use it, rather than preconfirming subscribers.
- Supports subscription management and unsubscribe links. Enable list preferences and test subscribing to one list, adding another, and unsubscribing from only one before launch.
- Plan for updates, database backups, signup rate limiting, sender-domain authentication, and bounce/complaint handling.

A possible address is `updates.bergknapp.works`. This is a proposal, not a provisioned endpoint. Keep Spaceship DNS; adding an external record does not require moving nameservers.

**Sending:** Amazon SES is a low-cost option. Current pricing lists Essentials at **$0.16 per 1,000 emails** for the initial volume tier, plus attachment/data charges. New eligible account/region combinations default to Essentials; AWS also offers à-la-carte pricing. Check the account's actual plan, domain verification, quotas, sandbox status, and production approval before enabling public signup confirmations.

## Hosted/free alternative: Brevo

Brevo is the simpler choice if avoiding service maintenance matters more than owning the database.

- Free plan: **300 email sends per day**, with unused quota not rolling over; official pricing help lists storage for **100,000 contacts**.
- Its multi-list subscription form block lets users choose interests, each mapped to a contact list. A profile-update form can manage those choices later.
- For a launch list exceeding 300 recipients, a single-day announcement needs a paid allowance; otherwise sending takes multiple days.

The Brevo help pages blocked direct content fetching during research. Limits and multi-list support were corroborated from indexed official help documents and Brevo's public bulk-email page; no account was created or plan behavior tested.

## Proposed signup model

- One email address; five independently selectable interests: Galdra, Knap, Narrowcast, Spacebar, Tuck.
- Homepage form: email plus app checkboxes. A product-specific form subscribes only to that product's list.
- Double opt-in confirmation, then send only updates relevant to the selected apps.
- Do not silently enroll app subscribers into an all-company newsletter. General Bergknapp updates would be a separate opt-in.
- Show clear success/error states and privacy information; do not add nonfunctional signup buttons before the backend exists.

## Sources

- [listmonk](https://listmonk.app/)
- [listmonk installation](https://listmonk.app/docs/installation/)
- [listmonk list types and opt-in](https://listmonk.app/docs/apis/lists/)
- [listmonk public signup API](https://listmonk.app/docs/apis/subscribers/#post-apipublicsubscription)
- [listmonk subscription concepts](https://listmonk.app/docs/concepts/)
- [Coolify listmonk service](https://coolify.io/docs/services/listmonk)
- [Amazon SES pricing](https://aws.amazon.com/ses/pricing/)
- [Brevo free bulk-email service](https://www.brevo.com/bulk-email-service/)
- [Brevo plan limits](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans)
- [Brevo multi-list subscription forms](https://help.brevo.com/hc/en-us/articles/360000545200-Enable-your-contacts-to-subscribe-or-unsubscribe-from-specific-lists-using-a-form-multi-list-subscriptions)
