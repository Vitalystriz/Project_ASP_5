const restaurantModel = require('../models/restaurant')

const getAllRestaurants = (req, res) => {
  const data = restaurantModel.getAllRestaurants();
  const userX = parseFloat(req.query.userX);
  const userY = parseFloat(req.query.userY);

  if (!isNaN(userX) && !isNaN(userY)) {
    const sortedData = data.map(restaurant => {
      const restX = parseFloat(restaurant.x) || 0;
      const restY = parseFloat(restaurant.y) || 0;
      const distance = Math.sqrt(
        Math.pow(userX - restX, 2) + Math.pow(userY - restY, 2)
      );
      return {
        ...restaurant,
        distance: parseFloat(distance.toFixed(2))
      };
    });
    sortedData.sort((a, b) => a.distance - b.distance);

    return res.status(200).json(sortedData);
  }
  res.status(200).json(data);
}

const createRestaurant = (req, res) => {
    const { name, type, description, x, y } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const newRestaurant = restaurantModel.createRestaurant(name, type, description, x, y);
    res.status(201).json(newRestaurant);
};

const getRestaurantByID = (req, res) => {
    const id = req.params.id;
    const restaurant = restaurantModel.getRestaurantByID(id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant was not found" });
    res.status(200).json(restaurant);
}

const updateRestaurantByID = (req, res) => {
    const id = req.params.id;
    const { name, type, description, x, y } = req.body;    
    const updatedRestaurant = restaurantModel.updateRestaurantByID(id, name, type, description, x, y);
        
    if (!updatedRestaurant) return res.status(404).json({ error: "Restaurant was not found" });
    res.status(200).json(updatedRestaurant);
}

const deleteRestaurantByID = (req, res) => {
    const id = req.params.id;
    const deletedRestaurant = restaurantModel.deleteRestaurantByID(id);
     
    if (!deletedRestaurant) return res.status(404).json({ error: "Restaurant not found" });
    res.status(204).send(); 
};

module.exports = { getAllRestaurants, createRestaurant, getRestaurantByID, updateRestaurantByID, deleteRestaurantByID }