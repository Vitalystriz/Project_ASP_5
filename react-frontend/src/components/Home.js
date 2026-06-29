import React from 'react';
import logo from '../assets/Volt_Logo.png'; 
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <img 
        src={logo} 
        alt="Volt Logo" 
        className="home-logo"
      />
      
      <h1 className="home-title">Welcome to Volt!</h1>
      
      <p className="home-subtitle">
        World's best delivery app
      </p>
    </div>
  );
};

export default Home;