import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const testBackend = async () => {
    try {
        console.log('1. Testing Health Check...');
        const health = await axios.get(`${API_URL}/health`);
        console.log('Health:', health.data);

        console.log('\n2. Registering User...');
        const email = `test${Date.now()}@example.com`;
        const user = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test User',
            email,
            password: 'password123',
        });
        console.log('User Registered:', user.data.email);
        const token = user.data.token;

        console.log('\n3. Creating Report...');
        const report = await axios.post(
            `${API_URL}/reports`,
            {
                category: 'road',
                description: 'Test report from script',
                lat: 28.6139,
                lng: 77.209,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('Report Created:', report.data._id);

        console.log('\n4. Fetching Reports...');
        const reports = await axios.get(`${API_URL}/reports`);
        console.log('Reports Count:', reports.data.length);
        console.log('Latest Report User:', reports.data[0].user.name);

        console.log('\nSUCCESS: Backend verification passed!');
    } catch (error: any) {
        console.error('\nFAILURE:', error.response?.data || error.message);
    }
};

testBackend();
