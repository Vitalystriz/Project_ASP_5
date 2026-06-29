const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const usersRouter = require('./routes/users');
const tokensRouter = require('./routes/tokens');
const restaurantsRoutes = require('./routes/restaurantRouter');
const ordersRouter = require('./routes/orders');
const search = require('./routes/search');


app.use('/api/users', usersRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/orders', ordersRouter);
app.use('/api/search', search);

const http = require('http');
const usersService = require('./services/usersService');
const restaurantService = require('./services/restaurantService')
const productService = require('./services/productService');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

const seedDatabase = async () => {
    try {
        // Ensure there is one and only one system user
        const systemUser = await mongoose.model('User').findOne({ username: 'system' });
        if (!systemUser) {
            console.log('[SEED] No system user found. Creating system user...');
            const newSystemUser = await usersService.createUser('System', 'system', 'password', '', 0, 0);
            if (newSystemUser) {
                newSystemUser.authorized = true;
                await newSystemUser.save();
                console.log('[SEED] System user created successfully.');
            }
        }

        // Ensure there is one global example restaurant and product
        const existingRestaurant = await mongoose.model('Restaurant').findOne({ name: "Example Restaurant" });
        if (!existingRestaurant) {
            console.log('[SEED] Example Restaurant not found. Creating example restaurant and product...');
            const restaurant = await restaurantService.createRestaurant(
                "Example Restaurant",
                "Fast Food",
                "An example restaurant created during initialization.",
                10,
                20
            );

            if (restaurant && restaurant.id) {
                console.log(`[SEED] Example Restaurant created successfully: ${restaurant.id}`);

                await productService.createProduct(
                    restaurant.id,
                    "Example Burger",
                    "Main Course",
                    "A delicious burger made with fresh ingredients.",
                    25.50
                );
                console.log("[SEED] Example Product created successfully.");
            }
        }
    } catch (error) {
        console.error("[SEED] Database seeding failed:", error);
    }
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project5'; // change to mongo

mongoose.connect(MONGODB_URI)
    .then(() => {
        // console.log(`Connected to MongoDB at ${MONGODB_URI}`);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            seedDatabase(PORT);
        });
    })
    .catch((err) => {
        // console.error('Failed to connect to MongoDB:', err);
    });