import bcrypt from 'bcryptjs';
import pool from './config/db.js';

async function updateAdminPassword() {
    try {
        const plainPassword = '123456';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const query = `
      UPDATE users 
      SET password = $1 
      WHERE email = 'admin@vrisa.com'
      RETURNING id, name, email, role
    `;

        const result = await pool.query(query, [hashedPassword]);

        if (result.rows.length > 0) {
            console.log('✅ Password updated successfully!');
            console.log('User:', result.rows[0]);
            console.log('\nYou can now login with:');
            console.log('  Email: admin@vrisa.com');
            console.log('  Password: 123456');
        } else {
            console.log('❌ User not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateAdminPassword();
