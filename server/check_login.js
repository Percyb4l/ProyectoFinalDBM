/**
 * @fileoverview Login Test Script
 * 
 * Utility script to test the authentication endpoint.
 * Sends a login request to verify the API is working correctly.
 * 
 * @module server/check_login
 */

import http from 'http';

/**
 * Test login credentials
 * 
 * @type {Object}
 */
const data = JSON.stringify({
    email: 'admin@vrisa.com',
    password: '123456'
});

/**
 * HTTP request options for login endpoint
 * 
 * @type {Object}
 */
const options = {
    hostname: '127.0.0.1',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

/**
 * Sends login request and logs response
 * 
 * Creates HTTP request to test authentication endpoint.
 * Logs status code and response body for debugging.
 */
const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
