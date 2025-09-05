# API

asciinema server provides an HTTP API for interacting with the server programmatically.

The latest version of the API is v1, and is available at `/api/v1/`.

## Authentication

All API endpoints require authentication using [HTTP Basic
Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#basic_authentication_scheme)
with your CLI install ID. The install ID uniquely identifies your CLI, and is
generated in `~/.config/asciinema/install-id` when running `asciinema auth` for
the first time on a given system.

Most endpoints require the CLI to be registered with the server by completing
the steps displayed by the `asciinema auth` command.

The exception is the upload endpoint (`POST /api/v1/recordings`). Unless the
server uses `UPLOAD_AUTH_REQUIRED=1` [configuration
option](self-hosting/configuration.md#authentication), this endpoint allows
requests from unregistered CLIs. In such cases, created recordings are
temporary and subject to automatic removal, unless the `asciinema auth` flow is
completed on the same system within [server-configured grace
period](../server/self-hosting/configuration.md#unclaimed-recordings-removal).
See [asciinema auth](../cli/usage.md#asciinema-auth) documentation for more
details.

!!! note

    The above is rather CLI-centric, and that's because the API evolved to
    support the needs of the asciinema CLI over the years. In the future, the server
    will provide other authentication methods, such as pre-authorized access tokens
    or OAuth2, to make the API easier to use in non-interactive contexts.

### Authentication header

Use the install ID as the password field in Basic Authentication. The username
field can be an empty string.

```
Authorization: Basic <base64(:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)>
```

For brevity, this header is omitted in request examples of endpoint descriptions.

### Example request using cURL

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X PATCH \
  -u ":${INSTALL_ID}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","visibility":"public"}' \
  https://asciinema.org/api/v1/recordings/123
```

## Request and response format

Most API endpoints expect request bodies to be JSON encoded (`Content-Type:
application/json`). Exceptions to this are noted in endpoint descriptions.

The only supported response format is also JSON, and requests must include
either `Accept: application/json` or `Accept: */*` header.

Successful responses (2xx status) return resource attributes directly (no
envelopes). Error responses (4xx status) typically return error details in the
`error` field.

## Errors

Common HTTP status codes used by the API for error cases:

| Status Code | Description |
|-------------|-------------|
| **401** | **Unauthorized** - Missing or invalid auth header |
| **403** | **Forbidden** - Access denied (e.g., streaming disabled) |
| **404** | **Not Found** - Resource not found |
| **422** | **Unprocessable Entity** - Validation errors |

## Resources

### Recordings

`Recording` resources represent terminal session recordings.

**Recording attributes:**

| Attribute | Type | Description | Modifiable |
|-----------|-------------|-------------|-----|
| `id` | Integer | Recording ID | No |
| `url` | String (URL) | Web URL | No |
| `file_url` | String (URL) | asciicast file URL | No |
| `audio_url` | String (URL) | Audio file URL, e.g., mp3 | Yes |
| `title` | String | A title | Yes |
| `description` | String (Markdown) | A description | Yes |
| `visibility` | Enum: `public`, `unlisted`, `private` | Visibility | Yes |

!!! note

    The `:id` path parameter in recording endpoints accepts either a recording's
    numerical ID (`id` in the table above) or a URL token.

    A URL token is a unique token assigned to unlisted and private recordings,
    and used in place of the numerical ID in web URLs of those recordings. For
    example, for a recording with the web URL
    `https://asciinema.org/a/iUagQ1fL8tBvSZYiQGfPFCWIP` the URL token is
    `iUagQ1fL8tBvSZYiQGfPFCWIP`.

#### Create

```http
POST /api/v1/recordings
```

Create a new recording from an [asciicast](../asciicast/v3.md) file.

!!! note

    In contrast to other endpoints, this one expects the request body to be
    encoded as `multipart/form-data`.

The only required attribute is `file`.

**Request:**

```http
POST /api/v1/recordings HTTP/1.1
Content-Type: multipart/form-data; boundary=----FormBoundary123
Accept: application/json

------FormBoundary123
Content-Disposition: form-data; name="file"; filename="demo.cast"
Content-Type: application/octet-stream

[recording file content]
------FormBoundary123--
```

**Response:**

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: https://asciinema.org/a/eST2byL7IZkbGOBaMqE4Jhrqp

{
  "id": 123,
  "url": "https://asciinema.org/a/eST2byL7IZkbGOBaMqE4Jhrqp",
  "file_url": "https://asciinema.org/a/eST2byL7IZkbGOBaMqE4Jhrqp.cast",
  "audio_url": null,
  "title": null,
  "description": null,
  "visibility": "unlisted"
}
```

**cURL example:**

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X POST \
  -u ":${INSTALL_ID}" \
  -F "file=@demo.cast" \
  https://asciinema.org/api/v1/recordings
```

#### Update

```http
PATCH /api/v1/recordings/:id
```

Update metadata and settings for an existing recording.

**Request:**

```http
PATCH /api/v1/recordings/123 HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "title": "Updated Recording Title",
  "description": "Updated description",
  "visibility": "public"
}
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "url": "https://asciinema.org/a/eST2byL7IZkbGOBaMqE4Jhrqp",
  "file_url": "https://asciinema.org/a/eST2byL7IZkbGOBaMqE4Jhrqp.cast",
  "audio_url": null,
  "title": "Updated Recording Title",
  "description": "Updated description",
  "visibility": "public"
}
```

**cURL example:**

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X PATCH \
  -u ":${INSTALL_ID}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","visibility":"public"}' \
  https://asciinema.org/api/v1/recordings/123
```

#### Delete

```http
DELETE /api/v1/recordings/:id
```

Permanently delete a recording.

**Request:**

```http
DELETE /api/v1/recordings/123 HTTP/1.1
Accept: application/json
```

**Response:**

```http
HTTP/1.1 204 No Content
```

**cURL example:**

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X DELETE -u ":${INSTALL_ID}" https://asciinema.org/api/v1/recordings/123
```

### Streams

`Stream` resources represent endpoint configurations for live terminal session broadcasts.

**Stream attributes:**

| Attribute | Type | Description | Modifiable |
|-----------|-------------|------|--------|
| `id` | Integer | Stream ID | No |
| `url` | String (URL) | Web URL | No |
| `ws_producer_url` | String (URL) | Producer WebSocket endpoint | No |
| `audio_url` | String (URL) | Audio URL, e.g., Icecast stream endpoint | Yes |
| `title` | String | A title | Yes |
| `description` | String (Markdown) | A description | Yes |
| `visibility` | Enum: `public`, `unlisted`, `private` | Visibility | Yes |

!!! note

    The `:id` path parameter in stream endpoints accepts either a stream's
    numerical ID (`id` in the table above) or a URL token.

    A URL token is a unique token assigned to unlisted and private streams, and
    used in place of the numerical ID in web URLs of those streams. For example, for a
    stream with the web URL `https://asciinema.org/s/iUagQ1fL8tBvSZYi` the URL token
    is `iUagQ1fL8tBvSZYi`.

#### List

```http
GET /api/v1/user/streams
```

List own streams.

This endpoint performs pagination and returns up to 10 streams per page by
default. Use `limit` query param to use higher limit (up to 100).

URL for the next page of results is returned in the standard
[Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Link)
response header, with `rel` set to `next`.

You can filter the streams by a prefix of a URL token (`En81VpLKVaA7U2NR` for
the first stream in the response below) using `prefix=...` query param. For
example: `prefix=En81`.

**Request:**

```http
GET /api/v1/user/streams?limit=3 HTTP/1.1
Content-Type: application/json
Accept: application/json
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json
Link: <https://asciinema.org/api/v1/user/streams?cursor=eyJpZCI6NTM5MDIsInByZWZpeCI6bnVsbH0%3D&limit=10>; rel="next"

[
  {
    "id": 1,
    "url": "https://asciinema.org/s/En81VpLKVaA7U2NR",
    "ws_producer_url": "wss://asciinema.org/ws/S/9pJm0ppDDtuyBHWQ",
    "audio_url": null,
    "live": true,
    "title": "Stream 1",
    "description": null,
    "visibility": "unlisted"
  },
  {
    "id": 2,
    "url": "https://asciinema.org/s/VaA7U2NREn81VpLK",
    "ws_producer_url": "wss://asciinema.org/ws/S/m0ppDDtuyBHWQ9pJ",
    "audio_url": null,
    "live": false,
    "title": "Stream 2",
    "description": null,
    "visibility": "public"
  },
  {
    "id": 3,
    "url": "https://asciinema.org/s/pLKVaA7U2NREn81V",
    "ws_producer_url": "wss://asciinema.org/ws/S/DDtuyBHWQ9pJm0pp",
    "audio_url": null,
    "live": true,
    "title": "Stream 3",
    "description": null,
    "visibility": "unlisted"
  }
]
```

**cURL example:**

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X GET \
  -u ":${INSTALL_ID}" \
  -H "Content-Type: application/json" \
  https://asciinema.org/api/v1/user/streams?limit=3
```

#### Create

```http
POST /api/v1/streams
```

Create a new live stream endpoint.

This doesn't start the broadcast automatically. A live stream can be started by
connecting to the producer WebSocket endpoint (`ws_producer_url`) and feeding
session events into it. See [Live streaming](streaming.md) for details.

This endpoint doesn't require any attributes, but some may be provided.

**Request:**

```http
POST /api/v1/streams HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "title": "Stream Title",
  "visibility": "public",
  "live": true
}
```

**Response:**

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: https://asciinema.org/s/En81VpLKVaA7U2NR

{
  "id": 123,
  "url": "https://asciinema.org/s/En81VpLKVaA7U2NR",
  "ws_producer_url": "wss://asciinema.org/ws/S/9pJm0ppDDtuyBHWQ",
  "audio_url": null,
  "live": true,
  "title": "Stream Title",
  "description": null,
  "visibility": "public"
}
```

**cURL example:**

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X POST \
  -u ":${INSTALL_ID}" \
  -H "Content-Type: application/json" \
  -d '{}' \
  https://asciinema.org/api/v1/streams
```

#### Update

```http
PATCH /api/v1/streams/:id
```

Update metadata and settings for an existing stream.

**Request:**

```http
PATCH /api/v1/streams/123 HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "title": "Updated Stream Title",
  "description": "Updated stream description",
  "live": true
}
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "url": "https://asciinema.org/s/En81VpLKVaA7U2NR",
  "ws_producer_url": "wss://asciinema.org/ws/S/9pJm0ppDDtuyBHWQ",
  "audio_url": null,
  "live": true,
  "title": "Updated Stream Title",
  "description": "Updated stream description",
  "visibility": "unlisted"
}
```

**cURL example:**

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X PATCH \
  -u ":${INSTALL_ID}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Stream Title","visibility":"public"}' \
  https://asciinema.org/api/v1/streams/123
```

#### Delete

```http
DELETE /api/v1/streams/:id
```

Permanently delete a stream.

**Request:**

```http
DELETE /api/v1/streams/123 HTTP/1.1
Accept: application/json
```

**Response:**

```http
HTTP/1.1 204 No Content
```

**cURL example:**

```bash
INSTALL_ID=$(cat ~/.config/asciinema/install-id)

curl -X DELETE -u ":${INSTALL_ID}" https://asciinema.org/api/v1/streams/123
```
