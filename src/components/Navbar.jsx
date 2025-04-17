import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.link}>Home</Link>
      <Link to="/account" style={styles.link}>Account Settings</Link>
      <button onClick={handleLogout} style={styles.button}>Logout</button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  button: {
    background: 'white',
    color: '#007bff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default Navbar;
