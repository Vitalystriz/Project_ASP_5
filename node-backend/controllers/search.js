const restaurantService = require('../services/restaurantService')
const productService = require('../services/productService')


exports.getSearchByQuery = async (req, res) => {
    try {
        const target = req.params.query.toLowerCase()

        const restaraunts = await restaurantService.findTarget(target)
        const products = await productService.findTarget(target)

        if ((!restaraunts || restaraunts.length === 0) && (!products || products.length === 0)) {
            return res.status(400).json({error: 'No results'})
        }
        
        res.status(200).json({restaraunts, products})
    } catch (error) {
        res.status(500).json({ error: "Internal server error during search", message: error.message });
    }
}