import { db } from "../index";
import { usersTable, spacesTable } from "../schema";
import { eq } from "drizzle-orm";

async function run() {
  const email = "gutierrez23nicolas@gmail.com";
  console.log(`Setting all spaces for ${email} to visible and published...`);
  
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email)
  });

  if (!user) {
    console.error("User not found!");
    return;
  }

  await db.transaction(async (tx) => {
    // Ensure user is verified
    await tx.update(usersTable)
      .set({ isUserVerified: true })
      .where(eq(usersTable.uid, user.uid));
      
    // Publish and make visible
    const res = await tx.update(spacesTable)
      .set({ 
        isVisible: true, 
        published: true, 
        status: 'approved' 
      })
      .where(eq(spacesTable.ownerId, user.uid));
      
    console.log(`Done! ${res.rowCount || 0} spaces are now Published, Approved, and Visible.`);
  });
}

run().catch(console.error).finally(() => process.exit(0));
