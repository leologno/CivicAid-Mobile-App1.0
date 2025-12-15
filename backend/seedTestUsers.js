const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Test Users Data
const users = [
    // 1. Admin
    {
        name: 'Admin User',
        email: 'admin@civicaid.com',
        password: 'password123',
        role: 'admin',
        phone: '01700000000',
        adminSecretCode: process.env.ADMIN_SECRET_CODE || '01798585919',
    },
    // 2. City Authority (Infrastructure)
    {
        name: 'City Corp Infrastructure',
        email: 'infrastructure@city.gov',
        password: 'password123',
        role: 'authority',
        phone: '01700000001',
        location: {
            latitude: 23.8103, // Dhaka coordinates
            longitude: 90.4125,
            address: 'Gulshan 1, Dhaka',
        },
        authorityDetails: {
            department: 'Infrastructure & Roads',
            jurisdiction: 'North Dhaka',
            categories: ['infrastructure', 'transport'],
            capacity: 50,
        },
    },
    // 3. Health Authority
    {
        name: 'City Health Dept',
        email: 'health@city.gov',
        password: 'password123',
        role: 'authority',
        phone: '01700000002',
        location: {
            latitude: 23.7940,
            longitude: 90.4043,
            address: 'Banani, Dhaka',
        },
        authorityDetails: {
            department: 'Public Health',
            jurisdiction: 'All Dhaka',
            categories: ['health', 'sanitation'],
            capacity: 50,
        },
    },
    // 4. NGO (Environment)
    {
        name: 'Green Earth NGO',
        email: 'contact@greenearth.org',
        password: 'password123',
        role: 'ngo',
        phone: '01700000003',
        location: {
            latitude: 23.8103,
            longitude: 90.4125,
            address: 'Gulshan 2, Dhaka',
        },
        ngoDetails: {
            name: 'Green Earth Bangladesh',
            registrationNumber: 'NGO-101',
            categories: ['environment', 'sanitation'],
            capacity: 20,
        },
    },
    // 5. NGO (Education)
    {
        name: 'EduLight Foundation',
        email: 'info@edulight.org',
        password: 'password123',
        role: 'ngo',
        phone: '01700000004',
        location: {
            latitude: 23.7509,
            longitude: 90.3935,
            address: 'Karwan Bazar, Dhaka',
        },
        ngoDetails: {
            name: 'EduLight Foundation',
            registrationNumber: 'NGO-102',
            categories: ['education', 'social'],
            capacity: 15,
        },
    },
    // 6. Volunteer (Safety)
    {
        name: 'Volunteer Rakib',
        email: 'rakib@volunteer.com',
        password: 'password123',
        role: 'volunteer',
        phone: '01700000005',
        location: {
            latitude: 23.8103,
            longitude: 90.4125,
            address: 'Gulshan 1, Dhaka',
        },
    },
    // 7. Volunteer (Environment)
    {
        name: 'Volunteer Sarah',
        email: 'sarah@volunteer.com',
        password: 'password123',
        role: 'volunteer',
        phone: '01700000006',
        location: {
            latitude: 23.7940,
            longitude: 90.4043,
            address: 'Banani, Dhaka',
        },
    },
    // 8. Regular User 1
    {
        name: 'Citizen Khan',
        email: 'khan@gmail.com',
        password: 'password123',
        role: 'user',
        phone: '01700000007',
    },
    // 9. Regular User 2
    {
        name: 'Citizen Ahmed',
        email: 'ahmed@gmail.com',
        password: 'password123',
        role: 'user',
        phone: '01700000008',
    },
    // 10. NGO (General)
    {
        name: 'Humanity First',
        email: 'help@humanity.org',
        password: 'password123',
        role: 'ngo',
        phone: '01700000009',
        location: {
            latitude: 23.7330,
            longitude: 90.3950,
            address: 'Shahbag, Dhaka',
        },
        ngoDetails: {
            name: 'Humanity First',
            registrationNumber: 'NGO-103',
            categories: ['other', 'safety'],
            capacity: 30,
        },
    },
];

const seedUsers = async () => {
    try {
        // Optional: Delete existing test users to avoid duplicates
        // await User.deleteMany({ email: { $in: users.map(u => u.email) } });

        for (const user of users) {
            const exists = await User.findOne({ email: user.email });
            if (!exists) {
                await User.create(user);
                console.log(`Created user: ${user.name} (${user.role})`);
            } else {
                console.log(`User already exists: ${user.email}`);
            }
        }

        // Write credentials to file
        const content = `CivicAID Test Credentials (Generated ${new Date().toISOString()})\n\n` +
            users.map(u =>
                `Role: ${u.role.toUpperCase()}\n` +
                `Name: ${u.name}\n` +
                `Email: ${u.email}\n` +
                `Password: ${u.password}\n` +
                (u.authorityDetails ? `Dept: ${u.authorityDetails.department}\n` : '') +
                (u.ngoDetails ? `NGO: ${u.ngoDetails.name}\n` : '') +
                `----------------------------------------\n`
            ).join('\n');

        fs.writeFileSync(path.join(__dirname, '..', 'test_credentials_civicaid.txt'), content);
        console.log('Credentials saved to test_credentials_civicaid.txt');

        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedUsers();
