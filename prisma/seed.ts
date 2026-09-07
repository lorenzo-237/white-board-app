import { prisma } from "../src/db"
import { hashPassword } from "../src/lib/auth/password"

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env")
  }

  const passwordHash = await hashPassword(password)
  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    create: {
      email: email.toLowerCase(),
      name: "Admin",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
    update: { passwordHash, role: "ADMIN", status: "ACTIVE" },
  })

  console.log(`Admin user ready: ${admin.email}`)
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
