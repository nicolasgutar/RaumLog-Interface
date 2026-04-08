import { db, usersTable, kycSubmissionsTable } from '../index';
import { eq } from 'drizzle-orm';

async function main() {
  const [user] = await db.select()
    .from(usersTable)
    .where(eq(usersTable.email, 'yorlis4@gmail.com'));
    
  if (!user) {
    console.log("User not found");
    return;
  }

  const kyc = await db.select()
    .from(kycSubmissionsTable)
    .where(eq(kycSubmissionsTable.hostEmail, user.email));
    
  console.log(JSON.stringify({ user, kyc }, null, 2));
}

main().catch(console.error);
