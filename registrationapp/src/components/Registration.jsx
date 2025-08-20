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

  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.f_name) newErrors.f_name = "First name is required.";
    if (!form.m_name) newErrors.m_name = "Middle name is required.";
    if (!form.l_name) newErrors.l_name = "Last name is required.";
    if (!form.mob) {
      newErrors.mob = "Mobile number is required.";
    } else if (!/^[6-9][0-9]{9}$/.test(form.mob)) {
      newErrors.mob = "Mobile must be 10 digits and start with 6, 7, 8, or 9.";
    }
    if (!form.email) newErrors.email = "Email is required.";
    if (!form.pass) newErrors.pass = "Password is required.";
    if (form.pass !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(
        "sentUser",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );
      if (photo) formData.append("image", photo);

      const res = await axios.post(
        "http://localhost:8080/user/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(`Registration successful for ${res.data.f_name || form.email}`);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="f_name"
          placeholder="First Name"
          value={form.f_name}
          onChange={handleChange}
        />
        {errors.f_name && <p className={styles.error}>{errors.f_name}</p>}

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
        />
        {errors.l_name && <p className={styles.error}>{errors.l_name}</p>}

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          readOnly
          disabled
          className={styles.disabled}
        />

        <input
          type="tel"
          name="mob"
          placeholder="Mobile Number"
          value={form.mob}
          onChange={handleChange}
        />
        {errors.mob && <p className={styles.error}>{errors.mob}</p>}

        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handlePhotoChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <div className={styles.passwordWrapper}>
          <input
            type={showPass ? "text" : "password"}
            name="pass"
            placeholder="Password"
            value={form.pass}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>
        {errors.pass && <p className={styles.error}>{errors.pass}</p>}

        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPass ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.showBtn}
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          >
            {showConfirmPass ? "Hide" : "Show"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className={styles.toggle} onClick={() => navigate("/login")}>
          Already a user? Login
        </p>
      </form>
    </div>
  );
};

export default Registration;
