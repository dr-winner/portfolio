import bcrypt from "bcryptjs";

const password = process.argv.slice(2).join(" ").trim();
if (!password) {
  console.error("Usage: npm run admin:hash -- \"your password\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
// base64url: safe in .env (no +, /, or = that some loaders mishandle)
const b64 = Buffer.from(hash, "utf8").toString("base64url");
console.log("\n# Add this to .env (required for Next.js — raw $ in bcrypt is mangled by env expansion):\n");
console.log(`ADMIN_PASSWORD_HASH_B64=${b64}\n`);
console.log("# Legacy (often breaks in .env without escaping every $):\n");
console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
console.log("Restart next dev / deploy after changing .env.\n");
