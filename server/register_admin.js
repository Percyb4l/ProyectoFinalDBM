import http from 'http';

const data = JSON.stringify({
    name: 'Administrador General',
    email: 'admin@vrisa.com',
    password: '123456',
    role: 'admin_general',
    institution_id: 1
});

const options = {
    hostname: '127.0.0.1',
    port: 3001,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Response:', body);
        if (res.statusCode === 201) {
            console.log('\n✅ Admin user created successfully!');
            console.log('You can now login with:');
            console.log('  Email: admin@vrisa.com');
            console.log('  Password: 123456');
        }
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
