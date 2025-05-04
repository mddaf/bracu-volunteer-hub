import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const AccountPage = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) setEmail(user.email);
  }, []);

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("user", JSON.stringify({ ...user, email }));
    alert("Profile updated!");
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>Edit Profile</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', width: '300px' }}
        />
        <br /><br />
        <button onClick={handleSave} style={{ padding: '10px 20px' }}>Save</button>
      </div>
    </>
  );
};

export default AccountPage;
