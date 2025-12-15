const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

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

const complaints = [
    {
        title: "Severe Waterlogging in Mirpur 10",
        description: "After the recent heavy rain, the road in front of the metro rail station is completely submerged. Rickshaws are overturning, and people cannot cross.",
        category: "infrastructure",
        priority: "high",
        location: {
            latitude: 23.8071,
            longitude: 90.3686,
            address: "Mirpur 10 Circle, Dhaka"
        },
        status: "pending"
    },
    {
        title: "Uncollected Garbage Pile in Dhanmondi",
        description: "A huge pile of household waste has been accumulating near Road 27 for three days. The smell is unbearable and it's attracting rats.",
        category: "sanitation",
        priority: "medium",
        location: {
            latitude: 23.7533,
            longitude: 90.3769,
            address: "Dhanmondi Road 27, Dhaka"
        },
        status: "pending"
    },
    {
        title: "Dengue Mosquito Breeding Spot",
        description: "Stagnant water in the abandoned construction site next to the school is breeding millions of mosquitoes. Children are at risk of Dengue.",
        category: "health",
        priority: "urgent",
        location: {
            latitude: 23.8759,
            longitude: 90.3928,
            address: "Sector 7, Uttara, Dhaka"
        },
        status: "pending"
    },
    {
        title: "Massive Pothole on Mohakhali Flyover Ramp",
        description: "There is a dangerous pothole right at the entrance of the flyover ramp. Several motorbikes have slipped. Needs immediate repair.",
        category: "transport",
        priority: "high",
        location: {
            latitude: 23.7776,
            longitude: 90.4054,
            address: "Mohakhali Flyover, Dhaka"
        },
        status: "pending"
    },
    {
        title: "Broken Street Lights in Gulshan Park",
        description: "Half of the street lights in the jogging track area are out. It feels unsafe to walk there after evening.",
        category: "safety",
        priority: "medium",
        location: {
            latitude: 23.7937,
            longitude: 90.4137,
            address: "Gulshan Tank Park, Dhaka"
        },
        status: "pending"
    },
    {
        title: "Illegal Gas Connection & Leakage",
        description: "Smell of gas leakage from a visible illegal tapping on the main line. Highly flammable and dangerous for the slum nearby.",
        category: "infrastructure",
        priority: "urgent",
        location: {
            latitude: 23.7197,
            longitude: 90.3951,
            address: "Lalbagh, Dhaka"
        },
        status: "pending"
    },
    {
        title: "Noise Pollution from Construction at Night",
        description: "Construction work continues late into the night (2 AM) violating city corporation rules. Residents cannot sleep.",
        category: "environment",
        priority: "low",
        location: {
            latitude: 23.7465,
            longitude: 90.4024,
            address: "Moghbazar, Dhaka"
        },
        status: "pending"
    }
];

const seedComplaints = async () => {
    try {
        // Fetch all users to assign complaints to them acting as citizens
        const users = await User.find({ role: 'user' });

        if (users.length === 0) {
            console.log('No users found. Run seedTestUsers.js first.');
            process.exit(0);
        }

        console.log(`Found ${users.length} users to assign complaints.`);

        // Clear existing complaints (optional, safer for testing)
        // await Complaint.deleteMany({}); 

        for (let i = 0; i < complaints.length; i++) {
            const complaint = complaints[i];
            const randomUser = users[Math.floor(Math.random() * users.length)];

            await Complaint.create({
                ...complaint,
                user: randomUser._id
            });
            console.log(`Created complaint: "${complaint.title}" by ${randomUser.name}`);
        }

        console.log('Seeding completed successfully.');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedComplaints();
