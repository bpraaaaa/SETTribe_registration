import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Report.module.css";
import { useParams, useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Report = () => {
  const { userid } = useParams();
  const navigate = useNavigate();
  const [admissionData, setAdmissionData] = useState(null);
  const [sentUser, setSentUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setError("");
    setMessage("");

    axios
      .get(`http://localhost:8080/user/${userid}`)
      .then((res) => setSentUser(res.data))
      .catch(() => setError("Failed to load user details"));

    axios
      .get(`http://localhost:8080/admission/${userid}`)
      .then((res) => setAdmissionData(res.data))
      .catch((err) => console.log(err.response?.data?.message));
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

  const handleDelete = async () => {
    if (!admissionData?.adm_id) {
      setError("Admission record not found for deletion.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this admission record?")) {
      try {
        await axios.delete(`http://localhost:8080/admission/delete/${admissionData.adm_id}`);
        setAdmissionData(null);
        setMessage("Admission deleted successfully!");
        setError("");
      } catch {
        setError("Failed to delete admission");
        setMessage("");
      }
    }
  };

  const handleExport = () => {
    const exportObj = admissionData
      ? {
          FullName: `${admissionData.title} ${admissionData.user.f_name} ${admissionData.user.m_name} ${admissionData.user.l_name}`,
          MotherName: admissionData.mother,
          Gender: admissionData.gender,
          Address: admissionData.addr,
          Taluka: admissionData.taluka,
          District: admissionData.district,
          PIN: admissionData.pin,
          State: admissionData.state,
          Mobile: admissionData.user.mob,
          Email: admissionData.user.email,
          Aadhaar: admissionData.aadhaar,
          DOB: new Date(admissionData.dob).toLocaleDateString(),
          Age: calculateAge(admissionData.dob),
          Religion: admissionData.religion,
          CasteCategory: admissionData.caste_cate,
          Caste: admissionData.caste,
          Handicap: admissionData.handicap ? "Yes" : "No",
        }
      : {
          FullName: `${sentUser?.f_name} ${sentUser?.m_name} ${sentUser?.l_name}`,
          Mobile: sentUser?.mob,
          Email: sentUser?.email,
        };

    const ws = XLSX.utils.json_to_sheet([exportObj]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `report_${userid}.xlsx`);
  };

  if (!admissionData) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>User Report</h2>
          </div>

          {sentUser?.photo && (
            <div className={styles.photoSection}>
              <img
                src={`http://localhost:8080/user/image/${userid}`}
                alt="User"
                className={styles.profilePhoto}
              />
            </div>
          )}

          <p className={styles.loading}>No admission details found.</p>

          {sentUser && (
            <table className={styles.table}>
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>{sentUser.f_name} {sentUser.m_name} {sentUser.l_name}</td>
                </tr>
                <tr>
                  <th>Mobile number</th>
                  <td>{sentUser.mob}</td>
                </tr>
                <tr>
                  <th>Email ID</th>
                  <td>{sentUser.email}</td>
                </tr>
              </tbody>
            </table>
          )}

          {message && <p className={styles.message}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.addBtn} onClick={() => navigate(`/admission/${userid}`)}>
            Add Details
          </button>
          <button onClick={handleExport} className={styles.exportBtn}>Export to Excel</button>
          <button className={styles.logoutBtn} onClick={() => navigate("/login")}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>User Report</h2>
        </div>

        {admissionData.user?.photo && (
          <div className={styles.photoSection}>
            <img
              src={`http://localhost:8080/user/image/${userid}`}
              alt="User"
              className={styles.profilePhoto}
            />
          </div>
        )}

        <table className={styles.table}>
          <tbody>
            <tr>
              <th>Full Name</th>
              <td>{admissionData.title} {admissionData.user.f_name} {admissionData.user.m_name} {admissionData.user.l_name}</td>
            </tr>
            <tr><th>Mother's Name</th><td>{admissionData.mother}</td></tr>
            <tr><th>Gender</th><td>{admissionData.gender}</td></tr>
            <tr><th>Address</th><td>{admissionData.addr}</td></tr>
            <tr><th>Taluka</th><td>{admissionData.taluka}</td></tr>
            <tr><th>District</th><td>{admissionData.district}</td></tr>
            <tr><th>PIN code</th><td>{admissionData.pin}</td></tr>
            <tr><th>State</th><td>{admissionData.state}</td></tr>
            <tr><th>Mobile number</th><td>{admissionData.user.mob}</td></tr>
            <tr><th>Email ID</th><td>{admissionData.user.email}</td></tr>
            <tr><th>Aadhaar number</th><td>{admissionData.aadhaar}</td></tr>
            <tr><th>Date of Birth</th><td>{new Date(admissionData.dob).toLocaleDateString()}</td></tr>
            <tr><th>Age</th><td>{calculateAge(admissionData.dob)}</td></tr>
            <tr><th>Religion</th><td>{admissionData.religion}</td></tr>
            <tr><th>Caste Category</th><td>{admissionData.caste_cate}</td></tr>
            <tr><th>Caste</th><td>{admissionData.caste}</td></tr>
            <tr><th>Handicap</th><td>{admissionData.handicap ? "Yes" : "No"}</td></tr>
          </tbody>
        </table>

        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.btnGroup}>
          <button className={styles.updateBtn} onClick={() => navigate(`/admission/${userid}`)}>Add/Edit Details</button>
          <button onClick={handleDelete} className={styles.delete}>Delete</button>
          <button onClick={handleExport} className={styles.exportBtn}>Export to Excel</button>
          <button className={styles.logoutBtn} onClick={() => navigate("/login")}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Report;
