import React, { useState } from "react";
import styles from "./Login.module.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", pass: "", captcha: "" });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [error, setError] = useState("");

  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 7);
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.captcha !== captcha) {
      setError("Captcha does not match!");
      setCaptcha(generateCaptcha());
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/user/validate", {
        email: form.email,
        pass: form.pass,
      });

      if (res.status === 200) {
        alert(`Welcome, ${res.data.f_name}!`);
        setError("");
        navigate(`/report/${res.data.user_id}`);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Server error. Please try later.");
      }
      setCaptcha(generateCaptcha());
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>

        <input
          type="text"
          name="email"
          placeholder="Email ID"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="pass"
          placeholder="Password"
          value={form.pass}
          onChange={handleChange}
          required
        />

        {/* Captcha display */}
        <div className={styles.captchaBox}>
          <span className={styles.captcha}>{captcha}</span>
          <button
            type="button"
            className={styles.refresh}
            onClick={() => setCaptcha(generateCaptcha())}
          >
            ↻
          </button>
        </div>

        <input
          type="text"
          name="captcha"
          placeholder="Enter Captcha"
          value={form.captcha}
          onChange={handleChange}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Login</button>

        <p
          className={styles.toggle}
          onClick={() => {
            navigate("/");
          }}
        >
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
};

export default Login;
