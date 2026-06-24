import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/Restaurant.css';

const Restaurant = ({ searchTerm, addToOrder }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = React.useState(null);
    const [filteredMenu, setFilteredMenu] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
        type: '',
        price: '',
        description: ''
    });
    const targetUserId = JSON.parse(localStorage.getItem('user'))?.id;

    React.useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);

                const resResponse = await fetch(`http://localhost:5000/api/restaurants/${id}`);
                let restaurantData;
                if (resResponse.ok) {
                    restaurantData = await resResponse.json();
                } else {
                    restaurantData = { _id: id, id: id, name: 'Restaurant Menu', description: '', x: 0, y: 0 };
                }

                const productsResponse = await fetch(`http://localhost:5000/api/restaurants/${id}/products`);
                let productsData = [];

                if (productsResponse.ok) {
                    const prodData = await productsResponse.json();
                    productsData = Array.isArray(prodData) ? prodData : (prodData.data || []);
                }

                const completeData = {
                    ...restaurantData,
                    menu: productsData
                };

                setRestaurant(completeData);
                setFilteredMenu(productsData);
            } catch (err) {
                console.error('Error fetching data from server:', err);
                setRestaurant({ _id: id, id: id, name: 'Restaurant Menu', description: '', x: 0, y: 0, menu: [] });
                setFilteredMenu([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRestaurantData();
        }
    }, [id]);

    React.useEffect(() => {
        if (!restaurant || !restaurant.menu) return;

        const lowerCaseSearch = (searchTerm || '').toLowerCase().trim();
        if (!lowerCaseSearch) {
            setFilteredMenu(restaurant.menu);
        } else {
            const filtered = restaurant.menu.filter(item =>
                (item.name && item.name.toLowerCase().includes(lowerCaseSearch)) ||
                (item.description && item.description.toLowerCase().includes(lowerCaseSearch)) ||
                (item.type && item.type.toLowerCase().includes(lowerCaseSearch))
            );
            setFilteredMenu(filtered);
        }
    }, [searchTerm, restaurant]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price) {
            alert("Please fill in at least Product Name and Price!");
            return;
        }

        const fallbackProdId = 'prod_' + Date.now().toString();
        const localProductBackup = {
            _id: fallbackProdId,
            id: fallbackProdId,
            restaurantId: id,
            name: formData.name,
            type: formData.type,
            price: Number(formData.price),
            description: formData.description
        };

        try {
            const response = await fetch(`http://localhost:5000/api/restaurants/${id}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'user-id': targetUserId},
                body: JSON.stringify({ ...localProductBackup, id: undefined, _id: undefined })
            });

            if (response.ok) {
                const data = await response.json();
                const savedProduct = data._id || data.id ? data : (data.data || localProductBackup);

                setRestaurant(prev => {
                    const updatedMenu = prev && prev.menu ? [...prev.menu, savedProduct] : [savedProduct];
                    return { ...prev, menu: updatedMenu };
                });
                setFilteredMenu(prev => [...prev, savedProduct]);
            } else {
                setRestaurant(prev => {
                    const updatedMenu = prev && prev.menu ? [...prev.menu, localProductBackup] : [localProductBackup];
                    return { ...prev, menu: updatedMenu };
                });
                setFilteredMenu(prev => [...prev, localProductBackup]);
            }
        } catch (err) {
            console.error('Error saving product:', err);
            setRestaurant(prev => {
                const updatedMenu = prev && prev.menu ? [...prev.menu, localProductBackup] : [localProductBackup];
                return { ...prev, menu: updatedMenu };
            });
            setFilteredMenu(prev => [...prev, localProductBackup]);
        } finally {
            setFormData({ name: '', type: '', price: '', description: '' });
            setIsModalOpen(false);
        }
    };

    if (loading) return <div className="loading">...</div>;

    return (
        <div className="restaurant-details-page">
            <div className="restaurant-header-row">
                <div className="header-buttons-container">
                    <button className="back-btn" onClick={() => navigate('/restaurants')}>← Back</button>
                    <button className="back-btn add-product-btn" onClick={() => setIsModalOpen(true)}>+ Add Product</button>
                </div>
                <h1 className="page-title">{restaurant?.name || 'Restaurant Menu'}</h1>
            </div>

            {restaurant?.description && <p className="res-details-description">{restaurant.description}</p>}
            {restaurant?.x !== undefined && restaurant?.y !== undefined && (
                <p className="res-details-coords" style={{ padding: '0 20px', color: '#666' }}>
                    📍 Coordinates: ({restaurant.x}, {restaurant.y})
                </p>
            )}

            <div className="menu-list">
                {filteredMenu.length > 0 ? (
                    filteredMenu.map((item) => (
                        <ProductCard key={item._id || item.id} item={item} restaurantId={id} addToOrder={addToOrder} />
                    ))
                ) : (
                    <div className="loading">No products found 😕</div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Product</h3>
                        <form onSubmit={handleAddProduct}>
                            <div className="modal-form-group">
                                <label>Product Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="modal-form-group">
                                <label>Category / Type</label>
                                <input type="text" name="type" value={formData.type} onChange={handleInputChange} />
                            </div>
                            <div className="modal-form-group">
                                <label>Price (ILS) *</label>
                                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                            </div>
                            <div className="modal-form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="modal-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="modal-submit-btn">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Restaurant;