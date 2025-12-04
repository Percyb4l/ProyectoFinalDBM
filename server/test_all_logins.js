import http from 'http';

const BASE_URL = '127.0.0.1';
const PORT = 3001;

const testLogin = (email, password) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ email, password });

        const options = {
            hostname: BASE_URL,
            port: PORT,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: body ? JSON.parse(body) : null
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
};

async function testAllUsers() {
    console.log('🧪 Testing Login for All User Types\n');
    console.log('='.repeat(80));

    const users = [
        { email: 'admin@vrisa.com', password: '123456', role: 'admin_general' },
        { email: 'admin.dagma@vrisa.com', password: 'dagma123', role: 'admin_institucion' },
        { email: 'operador.centro@vrisa.com', password: 'operador123', role: 'operador_estacion' },
        { email: 'investigador@vrisa.com', password: 'invest123', role: 'investigador' },
        { email: 'ciudadano@vrisa.com', password: 'ciudadano123', role: 'ciudadano' }
    ];

    for (const user of users) {
        try {
            const result = await testLogin(user.email, user.password);

            if (result.status === 200) {
                console.log(`\n✅ ${user.role.padEnd(20)}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Status: ${result.status} - Login Successful`);
                console.log(`   User: ${result.body.user.name}`);
                console.log(`   Token: ${result.body.token.substring(0, 20)}...`);
            } else {
                console.log(`\n❌ ${user.role.padEnd(20)}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Status: ${result.status}`);
                console.log(`   Error: ${result.body?.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.log(`\n❌ ${user.role.padEnd(20)}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Error: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Login Testing Complete\n');
}

testAllUsers();
