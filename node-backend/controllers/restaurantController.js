const restaurantModel = require('../services/restaurantService')

const getAllRestaurants = async (req, res) => {
  const data = await restaurantModel.getAllRestaurants();
  const userX = parseFloat(req.query.userX);
  const userY = parseFloat(req.query.userY);

  if (!isNaN(userX) && !isNaN(userY)) {
    const sortedData = data.map(restaurant => {
      const restObj = restaurant.toObject ? restaurant.toObject() : restaurant;
      const restX = parseFloat(restObj.x) || 0;
      const restY = parseFloat(restObj.y) || 0;
      const distance = Math.sqrt(
        Math.pow(userX - restX, 2) + Math.pow(userY - restY, 2)
      );
      return {
        ...restObj,
        distance: parseFloat(distance.toFixed(2))
      };
    });
    sortedData.sort((a, b) => a.distance - b.distance);

    return res.status(200).json(sortedData);
  }
  res.status(200).json(data);
}

const createRestaurant = async (req, res) => {
    const { name, type, description, x, y } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const newRestaurant = await restaurantModel.createRestaurant(name, type, description, x, y);
    res.status(201).json(newRestaurant);
};

const getRestaurantByID = async (req, res) => {
    const id = req.params.id;
    const restaurant = await restaurantModel.getRestaurantByID(id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant was not found" });
    res.status(200).json(restaurant);
}

const updateRestaurantByID = async (req, res) => {
    const id = req.params.id;
    const { name, type, description, x, y } = req.body;    
    const updatedRestaurant = await restaurantModel.updateRestaurantByID(id, name, type, description, x, y);
        
    if (!updatedRestaurant) return res.status(404).json({ error: "Restaurant was not found" });
    res.status(200).json(updatedRestaurant);
}

const deleteRestaurantByID = async (req, res) => {
    const id = req.params.id;
    const deletedRestaurant = await restaurantModel.deleteRestaurantByID(id);
     
    if (!deletedRestaurant) return res.status(404).json({ error: "Restaurant not found" });
    res.status(204).send(); 
};

module.exports = { getAllRestaurants, createRestaurant, getRestaurantByID, updateRestaurantByID, deleteRestaurantByID }