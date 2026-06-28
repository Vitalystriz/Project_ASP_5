import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/Product.css';
const Product = ({ addToOrder }) => {

    const { restaurantId, id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [recommendations, setRecommendations] = React.useState([]);

    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const targetUserId = parsedUser?._id || parsedUser?.id;



    React.useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                setError(false);


                const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}/products/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': targetUserId
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    const allLocalProducts = localStorage.getItem('local_products');
                    if (allLocalProducts) {
                        const parsed = JSON.parse(allLocalProducts);
                        const found = parsed.find(p => p._id === id || p.id === id);
                        if (found) {
                            setProduct(found);
                            return;
                        }
                    }
                    throw new Error('Product not found');
                }
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };


        if (restaurantId && id) fetchProductData();
    }, [restaurantId, id, targetUserId]);

    React.useEffect(() => {
        const fetchRecommendationsData = async () => {
            if (!restaurantId || !id || !targetUserId || !product) return;
            try {
                const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}/products/${id}/recommendations`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': targetUserId
                    }
                });

                if (response.ok) {
                    const payload = await response.json();
                    const recIds = payload.data || [];
                    
                    const recPromises = recIds.map(async (recId) => {
                        try {
                            const searchRes = await fetch(`http://localhost:5000/api/search/${recId}`);
                            if (searchRes.ok) {
                                const searchData = await searchRes.json();
                                if (searchData.products && searchData.products.length > 0) {
                                    return searchData.products.find(p => p.id === recId || p._id === recId);
                                }
                            }
                        } catch (err) {
                            console.error(`Error fetching recommendation details for product ID ${recId}:`, err);
                        }
                        return null;
                    });
                    
                    const resolvedRecs = await Promise.all(recPromises);
                    setRecommendations(resolvedRecs.filter(p => p !== null && p !== undefined));
                }
            } catch (err) {
                console.error('Error fetching recommendations:', err);
            }
        };

        fetchRecommendationsData();
    }, [restaurantId, id, targetUserId, product]);

    const handleAddToCartClick = async () => {
        if (!product) {
            alert('Could not add item to order.');
            return;
        }

        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const targetUserId = parsedUser?._id || parsedUser?.id;
        if (!targetUserId) {
            alert("Please log in first to add items to your order.");
            return;
        }

        try {
            // Get all orders from backend to see if user has an active order
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': targetUserId
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch existing orders');
            }

            const payload = await response.json();

            // Find an active order (status === "created" and userId === targetUserId)
            const activeOrder = payload.find(
                item => item.status === 'created' && item.userId === targetUserId
            );

            if (activeOrder) {
                // If there's an active order, we patch it
                let updatedProducts;
                if (activeOrder.restaurantId === restaurantId) {
                    // Same restaurant, merge products
                    const existingProductIndex = activeOrder.products.findIndex(
                        p => p.productId === id
                    );
                    if (existingProductIndex > -1) {
                        updatedProducts = activeOrder.products.map((p, idx) =>
                            idx === existingProductIndex ? { ...p, quantity: p.quantity + 1 } : p
                        );
                    } else {
                        updatedProducts = [...activeOrder.products, { productId: id, quantity: 1 }];
                    }
                } else {
                    // Different restaurant, overwrite restaurantId and reset products to this product
                    updatedProducts = [{ productId: id, quantity: 1 }];
                }

                const patchResponse = await fetch(`http://localhost:5000/api/orders/${activeOrder._id || activeOrder.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': targetUserId
                    },
                    body: JSON.stringify({
                        restaurantId: restaurantId,
                        products: updatedProducts
                    })
                });

                if (patchResponse.ok) {
                    alert(`${product.name} added to order! 🛒`);
                } else {
                    const errorData = await patchResponse.json();
                    alert(`Failed to update order: ${errorData.error || 'Unknown error'}`);
                }
            } else {
                // Create a new order
                const createResponse = await fetch('http://localhost:5000/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'user-id': targetUserId
                    },
                    body: JSON.stringify({
                        restaurantId: restaurantId,
                        products: [{ productId: id, quantity: 1 }]
                    })
                });

                if (createResponse.ok) {
                    alert(`${product.name} added to order! 🛒`);
                } else {
                    const errorData = await createResponse.json();
                    alert(`Failed to create order: ${errorData.error || 'Unknown error'}`);
                }
            }
        } catch (error) {
            console.error('Error adding product to order:', error);
            alert(`Error adding item to order: ${error.message}`);
        }
    };

    if (loading) return <div className="loading">...</div>;
    if (error || !product) return (
        <div className="empty-state-container">
            <h2>Product not found 😕</h2>
            <button className="back-btn" onClick={() => navigate(-1)}>
                Back
            </button>
        </div>
    );

    return (
        <div className="product-details-page">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <div className="product-details-card">
                <h1 className="product-name">{product.name}</h1>
                {product.type && (
                    <span className="product-type-tag">{product.type}</span>
                )}
                <p className="product-description">{product.description}</p>
                <span className="product-price">₪{product.price}</span>

                <button className="add-to-order-btn" onClick={handleAddToCartClick}>
                    Add to cart+
                </button>
            </div>

            {recommendations.length > 0 && (
                <div className="recommendations-section">
                    <h2 className="recommendations-title">Recommended for You</h2>
                    <div className="recommendations-list">
                        {recommendations.map((rec) => (
                            <ProductCard key={rec.id || rec._id} item={rec} restaurantId={rec.restaurantId || restaurantId} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
