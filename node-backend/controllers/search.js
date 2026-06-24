const Restaraunts = require('../models/restaurant')
const Products = require('../models/product')


exports.getSearchByQuery = (req,res) =>
    {
    const target = req.params.query.toLowerCase()

    const restaraunts = Restaraunts.findTarget(target)
    const products = Products.findTarget(target)

    if (!restaraunts && !products) {
        return res.status(400).json({error: 'No results'})
    }
    
    res.status(200).json({restaraunts, products})

}