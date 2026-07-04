import { Link } from "react-router-dom";
import { api } from "../services/api";  
import React, { useState } from 'react';

export default function Signup() {
  
  const [formData,setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    conformPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name] : e.target.value,


    });

   

  }
   const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);


    if( formData.password !== formData.conformPassword){
      alert("password doesnot match");
      setLoding(false);          
        


      return;
    } 
    try{
          const response = await api.post("/signup",{
            fullName: formData.fullName,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            password: formData.password,
             conformPassword: formData.conformPassword
          });
          alert(response.data.message);
          console.log(response.data.message);
        
        }catch(error)
           {
              if (error.response) {
        alert(error.response.data.message || "Registration failed");
      } else {
        alert("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };
             


    


  return (
    <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2>Student Registration</h2>
          <p className="text-muted">Create an account to raise complaints.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              className="form-control"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="conformPassword"
              className="form-control"
              value={formData.conformPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}