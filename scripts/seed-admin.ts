import { auth } from "../lib/auth";
import { db, mongoClient } from "../lib/mongodb";

async function main() {
  const name = process.env.ADMIN_NAME ?? "WedPlan Admin";
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  const users = db.collection("users");
  const existing = await users.findOne({ email });

  if (!existing) {
    await auth.api.signUpEmail({ body: { name, email, password } });
    console.log(`Created user ${email}`);
  } else {
    console.log(`User ${email} already exists, updating role only`);
  }

  await users.updateOne(
    { email },
    {
      $set: {
        role: "admin",
        isBlocked: false,
        emailVerified: true,
        updatedAt: new Date(),
      },
    }
  );

  console.log(`Admin ready: ${email}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoClient.close();
  });