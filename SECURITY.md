# Security notes

The public editor is not at `/admin`. That path returns 404. The real path is `ADMIN_PATH` in the host environment, and it is not written in the repository.

Sessions are rows in the database. Signing out deletes the row. The cookie is signed, `HttpOnly`, and `SameSite=Strict`. On HTTPS it uses the `__Host-` prefix.

Password sign-in stays available until `LEGACY_PASSWORD_LOGIN=false`. Passkeys and GitHub recovery need a GitHub OAuth app and are not switched on yet.

## Rotation

- `SESSION_SECRET`: generate a new 32+ character value, set it in every environment, and redeploy. Existing editor sessions stop working.
- `ADMIN_PASSWORD`: set a new 24+ character value and redeploy.
- `ADMIN_PATH`: set a new 24-character hex value and redeploy. Old bookmarks stop working.
- `ANALYTICS_SALT`: set a new value and redeploy. Old visitor hashes cannot be correlated with new ones.
- `GROQ_API_KEY` and `BLOB_READ_WRITE_TOKEN`: revoke them in the provider, then set the new value and redeploy.
- `DATABASE_URL`: rotate the database password in Neon and update every environment.

`GITHUB_TOKEN` is unused. Revoke it in GitHub if it is still present.
