import { db } from "../index";
import { usersTable } from "../schema";

async function list() {
  const all = await db.query.usersTable.findMany();
  console.log("Found:", all.map(u => u.email).join(", "));
}
list().finally(() => process.exit(0));
