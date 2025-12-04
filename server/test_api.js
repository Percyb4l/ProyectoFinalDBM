import http from 'http';

const BASE_URL = '127.0.0.1';
const PORT = 3001;

const testEndpoint = (method, path, data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: BASE_URL,
            port: PORT,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            const jsonData = JSON.stringify(data);
            options.headers['Content-Length'] = jsonData.length;
        }

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

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

async function runTests() {
    console.log('🧪 Testing VRISA Backend API Endpoints\n');
    console.log('='.repeat(50));

    const tests = [
        { name: 'GET /stations', method: 'GET', path: '/stations' },
        { name: 'GET /institutions', method: 'GET', path: '/institutions' },
        { name: 'GET /alerts', method: 'GET', path: '/alerts' },
        { name: 'GET /sensors/1', method: 'GET', path: '/sensors/1' },
        { name: 'GET /measurements/station/1', method: 'GET', path: '/measurements/station/1' },
    ];

    for (const test of tests) {
        try {
            const result = await testEndpoint(test.method, test.path, test.data);
            const status = result.status === 200 ? '✅' : '❌';
            console.log(`\n${status} ${test.name}`);
            console.log(`   Status: ${result.status}`);

            if (Array.isArray(result.body)) {
                console.log(`   Results: ${result.body.length} items`);
            } else if (result.body) {
                console.log(`   Response: ${JSON.stringify(result.body).substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`\n❌ ${test.name}`);
            console.log(`   Error: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ API Testing Complete\n');
}

runTests();
