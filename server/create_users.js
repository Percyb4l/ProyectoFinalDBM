import bcrypt from 'bcryptjs';
import pool from './config/db.js';

async function createUsers() {
    try {
        console.log('👥 Creating sample users for each role...\n');

        const users = [
            {
                name: 'Administrador General',
                email: 'admin@vrisa.com',
                password: '123456',
                role: 'admin_general',
                institution_id: null
            },
            {
                name: 'Carlos Rodríguez',
                email: 'admin.dagma@vrisa.com',
                password: 'dagma123',
                role: 'admin_institucion',
                institution_id: 1
            },
            {
                name: 'María González',
                email: 'operador.centro@vrisa.com',
                password: 'operador123',
                role: 'operador_estacion',
                institution_id: 1
            },
            {
                name: 'Dr. Juan Pérez',
                email: 'investigador@vrisa.com',
                password: 'invest123',
                role: 'investigador',
                institution_id: null
            },
            {
                name: 'Ana Martínez',
                email: 'ciudadano@vrisa.com',
                password: 'ciudadano123',
                role: 'ciudadano',
                institution_id: null
            }
        ];

        console.log('🔐 Hashing passwords...\n');

        for (const user of users) {
            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(user.password, 10);

                // Insert user
                const result = await pool.query(
                    `INSERT INTO users (name, email, password, role, institution_id) 
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) 
           DO UPDATE SET 
             password = EXCLUDED.password,
             name = EXCLUDED.name,
             role = EXCLUDED.role,
             institution_id = EXCLUDED.institution_id
           RETURNING id, name, email, role`,
                    [user.name, user.email, hashedPassword, user.role, user.institution_id]
                );

                const createdUser = result.rows[0];
                console.log(`✅ ${user.role.padEnd(20)} | ${user.email.padEnd(30)} | Password: ${user.password}`);
                console.log(`   Name: ${createdUser.name} (ID: ${createdUser.id})\n`);
            } catch (error) {
                console.error(`❌ Error creating user ${user.email}:`, error.message);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('🎉 User creation completed!\n');
        console.log('LOGIN CREDENTIALS:\n');
        console.log('Role                  | Email                          | Password');
        console.log('-'.repeat(80));
        users.forEach(user => {
            console.log(`${user.role.padEnd(20)} | ${user.email.padEnd(30)} | ${user.password}`);
        });
        console.log('='.repeat(80));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating users:', error);
        process.exit(1);
    }
}

createUsers();
