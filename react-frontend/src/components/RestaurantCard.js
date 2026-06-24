import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RestaurantCard.css';

const RestaurantCard = ({ restaurant, isFavorite, onToggleFavorite }) => {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/restaurant/${restaurant.id}`);
    };

    return (
        <div className="restaurant-card" onClick={handleCardClick} style={{ position: 'relative' }}>
            <div className="restaurant-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="restaurant-name">{restaurant.name}</h2>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(restaurant.id || restaurant._id);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'transform 0.2s'
                        }}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isFavorite ? '⭐' : '☆'}
                    </button>
                </div>

                <p className="restaurant-type">{restaurant.type}</p>
                
                {restaurant.description && (
                    <p className="restaurant-description">{restaurant.description}</p>
                )}
                
                <p className="restaurant-address">Coordinates: ({restaurant.x}, {restaurant.y})</p>

                {restaurant.distance !== undefined && (
                    <div className="restaurant-distance" style={{ marginTop: '8px', fontWeight: 'bold', color: '#009de0' }}>
                        🛵 {restaurant.distance} units away
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestaurantCard;