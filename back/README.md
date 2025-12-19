# Setup:

## Install rust

Follow instructions on this [website](https://rust-lang.org/tools/install/).

## Setup the .env file

- Copy the template.env file to a .env file.

- Fill all the variable
  - OAuth 42
    - Create a new 42 app on this [website](https://profile.intra.42.fr/oauth/applications) if you don't have one.
    - Client id, client secret, and redirect url are found on the 42 app page.
    - OAUTH_42_STATE_COOKIE_SIGNING_KEY should be generated using a cryptographically secure algorithm
      e.g.: `openssl rand -hex 64`
