import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgres://user:password@localhost:5433/raumlog"
});

async function run() {
  try {
    const email = 'gutierrez23nicolas@mail.com';
    console.log(`Checking user: ${email}`);

    // Update user
    const userRes = await pool.query(
      'UPDATE users SET is_user_verified = true WHERE email = $1 RETURNING uid, name',
      [email]
    );

    if (userRes.rows.length === 0) {
      console.log('User not found!');
      const all = await pool.query('SELECT email FROM users');
      console.log('Available emails:', all.rows.map(r => r.email).join(', '));
      return;
    }

    const { uid, name } = userRes.rows[0];
    console.log(`Updated user ${name} (${uid}) to Verified.`);

    // Update spaces
    const spaceRes = await pool.query(
      'UPDATE spaces SET is_visible = true WHERE owner_id = $1',
      [uid]
    );

    console.log(`Updated visibility for ${spaceRes.rowCount} spaces.`);
    
    // Result check
    const check = await pool.query('SELECT name, is_user_verified FROM users WHERE email = $1', [email]);
    console.log('Final user status:', check.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

run();
