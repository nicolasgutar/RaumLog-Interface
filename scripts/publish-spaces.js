import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgres://user:password@localhost:5433/raumlog"
});

async function run() {
  try {
    const email = 'gutierrez23nicolas@gmail.com';
    console.log(`Setting user ${email} spaces as published...`);

    // Get user UID
    const userRes = await pool.query('SELECT uid FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      console.log('User not found!');
      return;
    }
    const { uid } = userRes.rows[0];

    // Update spaces to published and visible
    const res = await pool.query(
      'UPDATE spaces SET published = true, is_visible = true, status = \'approved\' WHERE owner_id = $1',
      [uid]
    );

    console.log(`Updated ${res.rowCount} spaces to Published, Visible, and Approved.`);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await pool.end();
  }
}

run();
