import { db } from "../lib/db/src/index";
import { usersTable } from "../lib/db/src/schema/users";
import { spacesTable } from "../lib/db/src/schema/spaces";
import { eq } from "drizzle-orm";

async function main() {
  // Use the same env var the app uses
  process.env.DATABASE_URL = "postgres://user:password@localhost:5433/raumlog";
  
  const targetEmail = "gutierrez23nicolas@mail.com";
  console.log(`Searching for user: ${targetEmail}`);

  // Query all users to list them as well
  const allUsers = await db.query.usersTable.findMany();
  console.log(`Found ${allUsers.length} users in total.`);
  
  const user = allUsers.find(u => u.email === targetEmail);

  if (!user) {
    console.log("User not found!");
    console.log("Existing users:", allUsers.map(u => u.email).join(", "));
    return;
  }

  console.log(`Found user: ${user.name} (uid: ${user.uid})`);

  // 1. Update user
  console.log("Updating isUserVerified to true...");
  const [updatedUser] = await db.update(usersTable)
    .set({ isUserVerified: true })
    .where(eq(usersTable.uid, user.uid))
    .returning();

  // 2. Update spaces
  console.log("Updating all spaces to isVisible = true...");
  const updateRes = await db.update(spacesTable)
    .set({ isVisible: true })
    .where(eq(spacesTable.ownerId, user.uid));
  
  console.log("Successfully updated verification and visibility.");
}

main().catch(err => {
  console.error("Error during DB update:", err);
  process.exit(1);
}).finally(() => {
  console.log("Update finished.");
  process.exit(0);
});
