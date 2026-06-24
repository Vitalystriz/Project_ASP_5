import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Restaurants from './pages/Restaurants';
import RestaurantPage from './pages/Restaurant';
import ProductCard from './components/ProductCard';
import OrderPage from './pages/OrderPage';
import HistoryOrdersPage from './pages/HistoryOrdersPage';
import './styles/App.css';
import Product from "./pages/Product";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <BrowserRouter>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Routes>
        <Route path="/" element={<Home />} />
        {/*epic 1*/}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/*epic 2*/}
        <Route path="/restaurants" element={<ProtectedRoute><Restaurants searchTerm={searchTerm} /></ProtectedRoute>} />
        <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantPage searchTerm={searchTerm} /></ProtectedRoute>} />
        {/*epic 2+3*/}
        <Route path="/restaurant/:id/products" element={<ProtectedRoute><ProductCard /></ProtectedRoute>} />
        {/*epic 3*/}
        <Route path="/orders" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
        <Route path="/historyOrders" element={<ProtectedRoute><HistoryOrdersPage /></ProtectedRoute>} />
        <Route path="/restaurant/:restaurantId/products/:id" element={<ProtectedRoute><Product /> </ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
