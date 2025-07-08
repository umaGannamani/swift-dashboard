import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUser(data[0]));
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts.map((p) => p.charAt(0)).join("").slice(0, 2).toUpperCase();
  };

  return (
    <div className="profile">
      <div className="topbar">
        <div className="logo">SWIFT</div>
        <div className="user-chip">
          <span className="avatar-chip">{getInitials(user?.name)}</span>
          <span>{user?.name}</span>
        </div>
      </div>
      <div className="profile-content">
        <button className="back-btn" onClick={() => navigate("/")}>←</button>
        <h2 className="welcome">Welcome, {user?.name}</h2>
        <div className="card">
          <div className="avatar-lg-box">
            <div className="avatar-lg">{getInitials(user?.name)}</div>
            <div className="avatar-name">
              <div className="name-bold">{user?.name}</div>
              <div className="email-muted">{user?.email}</div>
            </div>
          </div>
          <div className="details">
            <div className="field">
              <label>User ID</label>
              <div>{user?.id}</div>
            </div>
            <div className="field">
              <label>Name</label>
              <div>{user?.name}</div>
            </div>
            <div className="field">
              <label>Email ID</label>
              <div>{user?.email}</div>
            </div>
            <div className="field">
              <label>Address</label>
              <div>{user?.address?.street}</div>
            </div>
            <div className="field">
              <label>Phone</label>
              <div>{user?.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;