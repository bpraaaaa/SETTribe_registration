import styles from "./Admission.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Admission = () => {
  const { userid } = useParams();
  const navigate = useNavigate();

  const [sentUser, setSentUser] = useState();
  const [userExists, setUserExists] = useState(false);
  //   const [admExists, setAdmExists] = useState(false);

  const [form, setForm] = useState({
    user: sentUser,
    title: "",
    mother: "",
    gender: "",
    addr: "",
    taluka: "",
    district: "",
    pin: "",
    state: "",
    aadhaar: "",
    dob: "",
    religion: "",
    caste_cate: "",
    caste: "",
    handicap: false,
    f_name: "",
    m_name: "",
    l_name: "",
    mob: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch user details first
    axios
      .get(`http://localhost:8080/user/${userid}`)
      .then((res) => {
        const user = res.data;
        setSentUser(user);
        setForm((prev) => ({
          ...prev,
          user: user,
          f_name: user.f_name || "",
          m_name: user.m_name || "",
          l_name: user.l_name || "",
          mob: user.mob || "",
          email: user.email || "",
        }));
      })
      .catch(() => {
        setError("Failed to load user details");
      });

    // Check if admission already exists for this user
    axios
      .get(`http://localhost:8080/admission/${userid}`)
      .then((res) => {
        const admission = res.data;
        if (admission && admission.user) {
          setUserExists(true);
          setForm((prev) => ({
            ...prev,
            ...admission, // pre-fill admission fields
            user: admission.user,
            // f_name: admission.user.f_name || "",
            // m_name: admission.user.m_name || "",
            // l_name: admission.user.l_name || "",
            // mob: admission.user.mob || "",
            // email: admission.user.email || "",
          }));
        }
      })
      .catch(() => {
        setUserExists(false); // no admission found
      });
  }, [userid]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      title: form.title,
      mother: form.mother,
      gender: form.gender,
      addr: form.addr,
      taluka: form.taluka,
      district: form.district,
      pin: form.pin,
      state: form.state,
      aadhaar: form.aadhaar,
      dob: form.dob,
      religion: form.religion,
      caste_cate: form.caste_cate,
      caste: form.caste,
      user: sentUser,
      handicap: form.handicap,
    });

    if (admExists) {
      try {
        await axios.put(`http://localhost:8080/admission/update/${userid}`, {
          title: form.title,
          mother: form.mother,
          gender: form.gender,
          addr: form.addr,
          taluka: form.taluka,
          district: form.district,
          pin: form.pin,
          state: form.state,
          aadhaar: form.aadhaar,
          dob: form.dob,
          religion: form.religion,
          caste_cate: form.caste_cate,
          caste: form.caste,
          user: sentUser,
          handicap: form.handicap,
        });
        setMessage("Admission form updated successfully!");
        setError("");
        navigate(`/report/${userid}`);
      } catch {
        setError("Failed to update admission form");
        setMessage("");
      }
    } else {
      try {
        await axios.post("http://localhost:8080/admission/add", {
          title: form.title,
          mother: form.mother,
          gender: form.gender,
          addr: form.addr,
          taluka: form.taluka,
          district: form.district,
          pin: form.pin,
          state: form.state,
          aadhaar: form.aadhaar,
          dob: form.dob,
          religion: form.religion,
          caste_cate: form.caste_cate,
          caste: form.caste,
          user: sentUser,
          handicap: form.handicap,
        });
        setMessage("Admission form submitted successfully!");
        setError("");
        navigate(`/report/${userid}`);
      } catch {
        setError("Failed to submit admission form");
        setMessage("");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Admission Form</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            name="f_name"
            value={form.f_name}
            readOnly
            disabled
          />
        </label>
        <label>
          Middle Name
          <input
            type="text"
            name="m_name"
            value={form.m_name}
            readOnly
            disabled
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            name="l_name"
            value={form.l_name}
            readOnly
            disabled
          />
        </label>
        <label>
          Title
          <select
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          >
            <option value="">Select Title</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
          </select>
        </label>

        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={
              form.title +
              " " +
              form.f_name +
              " " +
              form.m_name +
              " " +
              form.l_name
            }
            readOnly
            disabled
          />
        </label>
        <label>
          Mobile
          <input type="text" name="mob" value={form.mob} readOnly disabled />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            disabled
          />
        </label>

        <label>
          Mother’s Name
          <input
            type="text"
            name="mother"
            value={form.mother}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Gender
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Address
          <textarea
            name="addr"
            value={form.addr}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Taluka
          <input
            type="text"
            name="taluka"
            value={form.taluka}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          District
          <input
            type="text"
            name="district"
            value={form.district}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          PIN
          <input
            type="number"
            name="pin"
            value={form.pin}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          State
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Aadhaar
          <input
            type="number"
            name="aadhaar"
            value={form.aadhaar}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Religion
          <input
            type="text"
            name="religion"
            value={form.religion}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Caste Category
          <input
            type="text"
            name="caste_cate"
            value={form.caste_cate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Caste
          <input
            type="text"
            name="caste"
            value={form.caste}
            onChange={handleChange}
            required
          />
        </label>

        {/* caste certi */}

        {/* marksheet */}

        <label className={styles.checkboxLabel}>
          Handicap
          <input
            type="checkbox"
            name="handicap"
            checked={form.handicap}
            onChange={handleChange}
          />
        </label>

        <button type="submit">
          {userExists ? "Update details" : "Submit details"}
        </button>
        <button onClick={() => navigate(`/report/${userid}`)}>Cancel</button>

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Admission;
