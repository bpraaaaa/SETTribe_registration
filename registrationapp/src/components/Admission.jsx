import styles from "./Admission.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Admission = () => {
  const { userid } = useParams();
  const navigate = useNavigate();

  const [sentUser, setSentUser] = useState();
  const [userExists, setUserExists] = useState(false);

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

  const [certi, setCerti] = useState(null);
  const [marks, setMarks] = useState(null);
  const [sign, setSign] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
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
      .catch(() => setError("Failed to load user details"));

    axios
      .get(`http://localhost:8080/admission/${userid}`)
      .then((res) => {
        const admission = res.data;
        if (admission && admission.user) {
          setUserExists(true);
          setForm((prev) => ({
            ...prev,
            ...admission,
            user: admission.user,
          }));
        }
      })
      .catch(() => setUserExists(false));
  }, [userid]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title") {
      let updatedGender = form.gender;
      if (value === "Mr.") updatedGender = "Male";
      else if (value === "Mrs.") updatedGender = "Female";

      setForm({
        ...form,
        title: value,
        gender: updatedGender,
      });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleCertiChange = (e) => {
    setCerti(e.target.files[0]);
  };
  const handleMarksChange = (e) => {
    setMarks(e.target.files[0]);
  };
  const handleSignChange = (e) => {
    setSign(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{12}$/.test(form.aadhaar)) {
      alert("Aadhaar number must be 12 digits");
      return;
    }

    if (userExists) {
      const formData = new FormData();
        formData.append(
          "sentAdmission",
          new Blob([JSON.stringify(form)], { type: "application/json" })
        );
        if (certi) formData.append("certi_image", certi);
        if (marks) formData.append("marks_image", marks);
        if (sign) formData.append("sign_image", sign);
console.log(formData);

        const res = await axios.put(
          `http://localhost:8080/admission/update/${userid}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert(`Updation successful for ${res.data.f_name || form.email}`);
        setMessage("Admission form updated successfully!");        
        navigate(`/report/${userid}`);
      
    } else {
        const formData = new FormData();
        formData.append(
          "sentAdmission",
          new Blob([JSON.stringify(form)], { type: "application/json" })
        );
        if (certi) formData.append("certi_image", certi);
        if (marks) formData.append("marks_image", marks);
        if (sign) formData.append("sign_image", sign);

        const res = await axios.post(
          `http://localhost:8080/admission/add/${userid}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        alert(`Registration successful for ${res.data.f_name || form.email}`);
        setMessage("Admission form submitted successfully!");
        navigate(`/report/${userid}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Admission Form</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label>Title</label>
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
        </div>

        <div className={styles.row}>
          <label>First Name</label>
          <input
            type="text"
            name="f_name"
            value={form.f_name}
            readOnly
            disabled
          />
        </div>

        <div className={styles.row}>
          <label>Middle Name</label>
          <input
            type="text"
            name="m_name"
            value={form.m_name}
            readOnly
            disabled
          />
        </div>

        <div className={styles.row}>
          <label>Last Name</label>
          <input
            type="text"
            name="l_name"
            value={form.l_name}
            readOnly
            disabled
          />
        </div>

        <div className={styles.row}>
          <label>Full Name</label>
          <input
            type="text"
            value={`${form.title} ${form.f_name} ${form.m_name} ${form.l_name}`}
            readOnly
            disabled
          />
        </div>

        <div className={styles.row}>
          <label>Mother’s Name</label>
          <input
            type="text"
            name="mother"
            value={form.mother}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            disabled={form.title === "Mr." || form.title === "Mrs."}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.row}>
          <label>Address</label>
          <textarea
            name="addr"
            value={form.addr}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>Taluka</label>
          <input
            type="text"
            name="taluka"
            value={form.taluka}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>District</label>
          <input
            type="text"
            name="district"
            value={form.district}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>PIN</label>
          <input
            type="number"
            name="pin"
            value={form.pin}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>Mobile</label>
          <input type="text" name="mob" value={form.mob} readOnly disabled />
        </div>

        <div className={styles.row}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            disabled
          />
        </div>

        <div className={styles.row}>
          <label>Aadhaar</label>
          <input
            type="number"
            name="aadhaar"
            value={form.aadhaar}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>Religion</label>
          <input
            type="text"
            name="religion"
            value={form.religion}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>Caste Category</label>
          <input
            type="text"
            name="caste_cate"
            value={form.caste_cate}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.row}>
          <label>Caste</label>
          <input
            type="text"
            name="caste"
            value={form.caste}
            onChange={handleChange}
            required
          />
        </div>

        {/* caste_certi */}
        <div className={styles.row}>
          <label>Caste Certificate</label>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleCertiChange}
          />
        </div>

        {/* marksheet */}
        <div className={styles.row}>
          <label>Marksheet</label>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleMarksChange}
          />
        </div>

        {/* photo
        <div className={styles.row}>
          <label>Photo</label>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handlePhotoChange}
          />
        </div> */}

        {/* sign */}
        <div className={styles.row}>
          <label>Signature</label>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleSignChange}
          />
        </div>

        <div className={styles.checkboxRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="handicap"
              checked={form.handicap}
              onChange={handleChange}
            />
            Handicap
          </label>
        </div>

        <div className={styles.actions}>
          <button type="submit">{userExists ? "Update" : "Submit"}</button>
          <button type="button" onClick={() => navigate(`/report/${userid}`)}>
            Cancel
          </button>
        </div>

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Admission;
