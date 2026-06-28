# Administration

asciinema server includes an admin panel - a web interface for managing the
users, recordings, and streams on your instance. From it you can search and
inspect content, change visibility, feature or archive recordings, merge or
delete accounts, grant admin access, and monitor the running system.

## Accessing the admin panel

There are two ways to reach the admin panel.

### Dedicated admin port

By default the admin panel is served on its own port, **4002**, separate from
the main, user-facing site. When deploying with Docker, expose this port to
reach it:

```yaml title="docker-compose.yml"
services:
  asciinema:
    ports:
      - '4002:4002'
```

!!! danger

    The dedicated admin endpoint performs **no authentication** - anyone who can
    reach port 4002 has full admin access. Never expose it directly to the
    internet. Keep it bound to localhost (the default) and reach it through an
    SSH tunnel or VPN, or place it behind a reverse proxy that restricts access
    by IP address and/or requires authentication.

The admin endpoint's network binding and the URLs it generates can be adjusted
with `ADMIN_PORT`, `ADMIN_BIND_ALL`, and the `ADMIN_URL_*` variables - see
[Configuration](configuration.md#admin-panel).

### On the main web interface

Alternatively, set `ADMIN_PANEL_ON_MAIN_ENDPOINT=1` to also serve the panel at
`/admin` on the main, user-facing site. In this mode access is **login-gated**:
visitors who aren't logged in are redirected to the login page, and logged-in
users without the admin flag get a 404 response, so the panel's existence isn't
revealed to regular users. With this enabled you don't need to expose port 4002.

## Granting admin access

A user is an admin when their account has the admin flag set.

### The first account becomes an admin

On a brand-new instance the **first registered account is automatically made an
admin**, so you can bootstrap a fresh server simply by signing up. All
subsequent accounts are regular users. On a server without SMTP, complete that
first sign-up by opening the login link from the logs; see
[Email](configuration.md#email).

### Toggling the admin flag

Admins can grant or revoke the flag on any account from that user's edit page in
the panel (the **admin** checkbox). As a safeguard, you can't remove the admin
flag from your own account this way.

On an existing instance that has no admin yet, use the [dedicated admin
port](#dedicated-admin-port) - which doesn't require logging in - to open a
user's edit page and grant them the flag.

## What you can do

### Dashboard

The landing page shows totals (users, recordings, streams, live streams) and
recent activity - the latest signups, uploads, and stream sessions.

### Users

Search and browse accounts; view a user's recordings, streams, and authorized
CLIs; edit their details; generate a one-time login link; toggle the admin and
streaming flags; merge one account into another; and delete accounts.

### Recordings

Search and browse recordings; view and edit a recording; change its visibility
(public / unlisted / private); feature or unfeature it; archive or unarchive it;
and delete it.

### Streams

Search and browse live streams; view and edit a stream; change its visibility;
forcibly disconnect an active stream; and delete it.

### System dashboards

Under **System** there's a live system dashboard (runtime metrics, processes,
memory), powered by Phoenix LiveDashboard, and an Oban dashboard for inspecting
the background job queues.

## Searching

Each list - Users, Recordings, and Streams - has a search box that accepts a
compact `field:value` syntax. Bare words (without a `field:`) match identity
(users) or title (recordings and streams), and multiple terms are combined with
AND. Beyond text you can filter by things like owner, visibility, dates, counts,
size, and duration - with comparisons (`>`, `>=`, `<`, `<=`) and ranges
(`a..b`). A few examples:

- `admin:no registered:yes created:30d` - regular accounts created in the last 30 days
- `visibility:public featured:no views:>1000` - popular public recordings that aren't featured
- `live:yes peak-viewers:>50` - busy live streams

For the full, always-current list of fields and value formats, click the **Query
syntax help** button next to the search box - it opens a cheat sheet for the list
you're viewing.

### Saved queries

Once you've composed a search you can save it under a name to reuse later. Saved
queries are scoped to their list (Users, Recordings, or Streams) and are shared
by all admins. When the current search matches a saved one, the search box lets
you rename or delete it.

## Security

The two access modes have very different trust models:

- The **dedicated admin port (4002)** is unauthenticated and relies entirely on
  the network being restricted - treat anything that can reach it as fully
  trusted, and keep it on localhost or behind an IP-restricted reverse proxy or
  VPN.
- The **main-endpoint mode** (`ADMIN_PANEL_ON_MAIN_ENDPOINT=1`) is login-gated
  and serves only admins; non-admins get a 404 and anonymous visitors are sent
  to the login page.
