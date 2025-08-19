import React, { useState } from "react";
import styles from "./Registration.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    f_name: "",
    m_name: "",
    l_name: "",
    fullName: "",
    mob: "",
    email: "",
    pass: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...form, [name]: value };

    if (["f_name", "m_name", "l_name"].includes(name)) {
      updated.fullName = [updated.f_name, updated.m_name, updated.l_name]
        .filter(Boolean)
        .join(" ");
    }
    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.f_name ||
      !form.m_name ||
      !form.l_name ||
      !form.mob ||
      !form.email ||
      !form.pass ||
      !form.confirmPassword
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    if (form.pass !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mob)) {
      alert("Mobile number must be 10 digits!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/user/register", {
        f_name: form.f_name,
        m_name: form.m_name,
        l_name: form.l_name,
        mob: form.mob,
        email: form.email,
        pass: form.pass,
      });

      alert(`Registration successful for ${res.data.fullName || form.email}`);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input
          type="text"
          name="f_name"
          placeholder="First Name"
          value={form.f_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="m_name"
          placeholder="Middle Name"
          value={form.m_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="l_name"
          placeholder="Last Name"
          value={form.l_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          readOnly
          disabled
        />
        <input
          type="tel"
          name="mob"
          placeholder="Mobile Number"
          value={form.mob}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
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
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>

        <p
          className={styles.toggle}
          onClick={() => {
            navigate("/login");
          }}
        >
          Already a user? Login
        </p>
      </form>
    </div>
  );
};

export default Registration;
