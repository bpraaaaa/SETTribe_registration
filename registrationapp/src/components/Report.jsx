import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Report.module.css";
import { useParams, useNavigate } from "react-router-dom";

const Report = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [admissionData, setAdmissionData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/admission/${userid}`)
      .then((res) => setAdmissionData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load user report")
      );
  }, [userid]);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

//   if (error) return <p className={styles.error}>{error}</p>;
  if (!admissionData)
    return (
      <div className={styles.container}>
        <p className={styles.loading}>No admission details found.</p>
        <button
          className={styles.addBtn}
          onClick={() => navigate(`/admission/${userid}`)}
        >
          Add Details
        </button>
      </div>
    );

  return (
    <div className={styles.container}>
      <h2>User Report</h2>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>Full Name</th>
            <td>
              {admissionData.title} {admissionData.user.f_name}{" "}
              {admissionData.user.m_name} {admissionData.user.l_name}
            </td>
          </tr>
          <tr>
            <th>Mother's Name</th>
            <td>{admissionData.mother}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{admissionData.gender}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{admissionData.addr}</td>
          </tr>
          <tr>
            <th>Taluka</th>
            <td>{admissionData.taluka}</td>
          </tr>
          <tr>
            <th>District</th>
            <td>{admissionData.district}</td>
          </tr>
          <tr>
            <th>PIN</th>
            <td>{admissionData.pin}</td>
          </tr>
          <tr>
            <th>State</th>
            <td>{admissionData.state}</td>
          </tr>
          <tr>
            <th>Mobile</th>
            <td>{admissionData.user.mob}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{admissionData.user.email}</td>
          </tr>
          <tr>
            <th>Aadhaar</th>
            <td>{admissionData.aadhaar}</td>
          </tr>
          <tr>
            <th>Date of Birth</th>
            <td>{new Date(admissionData.dob).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Age</th>
            <td>{calculateAge(admissionData.dob)}</td>
          </tr>
          <tr>
            <th>Religion</th>
            <td>{admissionData.religion}</td>
          </tr>
          <tr>
            <th>Caste Category</th>
            <td>{admissionData.caste_cate}</td>
          </tr>
          <tr>
            <th>Caste</th>
            <td>{admissionData.caste}</td>
          </tr>
          <tr>
            <th>Handicap</th>
            <td>{admissionData.handicap ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </table>

      <button
        className={styles.updateBtn}
        onClick={() => navigate(`/admission/${userid}`)}
      >
        Add/Edit Details
      </button>
    </div>
  );
};

export default Report;
