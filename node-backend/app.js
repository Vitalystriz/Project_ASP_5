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

const seedDatabase = async (port) => {
    try {
        const existingUser = await usersService.getUserByUsername('system_init_')
        if(!existingUser) {
            const systemUser = await usersService.createUser('System', 'system_init_' + Date.now(), 'password', '', 0, 0);
            if (systemUser) {
                systemUser.authorized = true;
                await systemUser.save();
            }
        }


        const exampleRestaurant = await restaurantService.getAllRestaurants()
        if (!exampleRestaurant) {
            const restaurant = await restaurantService.createRestaurant(
                "ExampleRestaurant",
                "Fast Food",
                "An example restaurant created during initialization.",
                10,
                20
            );
            if (restaurant && restaurant.id) {
                console.log(`[SEED] ExampleRestaurant created successfully: ${restaurant.id}`);

                await productService.createProduct(
                    restaurant.id,
                    "ExampleProduct",
                    "Food",
                    "An example product created during initialization.",
                    15
                );
                console.log("[SEED] ExampleProduct created successfully.");
            }
        }




    } catch (error) {
        console.error("[SEED] Database seeding failed:", error);
    }
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project5';

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