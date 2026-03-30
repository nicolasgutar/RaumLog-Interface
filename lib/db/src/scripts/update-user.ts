import { db } from "../index";
import { usersTable, spacesTable } from "../schema";
import { eq, or } from "drizzle-orm";

async function run() {
  // Use Gmail as seen in scan, or mail as provided by user
  const emails = ["gutierrez23nicolas@gmail.com", "gutierrez23nicolas@mail.com"];
  console.log(`Setting user with email(s) ${emails.join(" or ")} to verified...`);
  
  const user = await db.query.usersTable.findFirst({
    where: or(eq(usersTable.email, emails[0]), eq(usersTable.email, emails[1]))
  });

  if (!user) {
    console.error("User not found in database!");
    return;
  }

  console.log(`Updating user ${user.email} (UID: ${user.uid})...`);

  await db.transaction(async (tx) => {
    // 1. Verify user
    await tx.update(usersTable)
      .set({ isUserVerified: true })
      .where(eq(usersTable.uid, user.uid));

    // 2. Make spaces visible
    const res = await tx.update(spacesTable)
      .set({ isVisible: true })
      .where(eq(spacesTable.ownerId, user.uid));

    console.log(`Done! User is now verified and ${res.rowCount || 0} spaces belonging to them are now visible.`);
  });
}

run().catch(console.error).finally(() => process.exit(0));
