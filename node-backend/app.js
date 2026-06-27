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
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

const seedDatabase = async (port) => {
    try {
        const systemUser = await usersService.createUser('System', 'system_init_' + Date.now(), 'password', '', 0, 0);
        if (systemUser) {
            systemUser.authorized = true;
            await systemUser.save();
        }

        const restData = JSON.stringify({
            name: "ExampleRestaurant",
            type: "Fast Food",
            description: "An example restaurant created during initialization.",
            x: 10,
            y: 20
        });

        const options = {
            hostname: '127.0.0.1',
            port: port,
            path: '/api/restaurants',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': systemUser.id,
                'Content-Length': Buffer.byteLength(restData)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const restaurant = JSON.parse(body);
                    if (restaurant && restaurant.id) {
                        console.log(`[SEED] ExampleRestaurant created successfully: ${restaurant.id}`);
                        
                        const productData = JSON.stringify({
                            name: "ExampleProduct",
                            type: "Food",
                            description: "An example product created during initialization.",
                            price: 15
                        });

                        const prodOptions = {
                            hostname: '127.0.0.1',
                            port: port,
                            path: `/api/restaurants/${restaurant.id}/products`,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'user-id': systemUser.id,
                                'Content-Length': Buffer.byteLength(productData)
                            }
                        };

                        const prodReq = http.request(prodOptions, (prodRes) => {
                            let prodBody = '';
                            prodRes.on('data', (chunk) => prodBody += chunk);
                            prodRes.on('end', () => {
                                console.log("[SEED] ExampleProduct created successfully.");
                            });
                        });
                        prodReq.on('error', (err) => console.error("[SEED] Error creating ExampleProduct:", err));
                        prodReq.write(productData);
                        prodReq.end();
                    }
                } catch (e) {
                    console.error("[SEED] Failed to parse restaurant response:", e);
                }
            });
        });

        req.on('error', (err) => {
            console.error("[SEED] Error creating ExampleRestaurant:", err);
        });

        req.write(restData);
        req.end();

    } catch (error) {
        console.error("[SEED] Database seeding failed:", error);
    }
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project5';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log(`Connected to MongoDB at ${MONGODB_URI}`);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            seedDatabase(PORT);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });