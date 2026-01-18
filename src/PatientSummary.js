import React, { useState } from "react";

function PatientSummary({ onBack }) {
    // Mock Data mimicking a backend summary response
    const summaries = [
        {
            date: "2024-01-07",
            title: "Treatment Inquiry",
            summary: "Patient asked about specific immunotherapy options for Stage 2 Lung Cancer. Expressed concern about side effects compared to chemotherapy.",
            sentiment: "Anxious"
        },
        {
            date: "2024-01-05",
            title: "Initial Consultation",
            summary: "Patient reported persistent cough and shortness of breath. Discussed diagnostic reports (CT Scan) indicating a mass in the right lung.",
            sentiment: "Neutral"
        },
        {
            date: "2023-12-28",
            title: "Symptom Check",
            summary: "Patient complained of chest pain and fatigue. Recommended visiting a specialist for further screening.",
            sentiment: "Worried"
        }
    ];

    const [filterDate, setFilterDate] = useState("");

    const filteredSummaries = filterDate
        ? summaries.filter(s => s.date === filterDate)
        : summaries;

    return (
        <div className="app-container">
            <div className="chat-window desktop summary-layout">
                {/* HEADER */}
                <div className="chat-header">
                    <div className="header-info">
                        <div className="bot-avatar">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </div>
                        <div className="header-text">
                            <h3>Patient Summary</h3>
                            <div className="status-badge">Dr. View</div>
                        </div>
                    </div>

                    <div className="header-controls">
                        {/* Date Picker */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="date"
                                className="styled-date-input"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            {filterDate && (
                                <button
                                    onClick={() => setFilterDate("")}
                                    style={{
                                        position: 'absolute',
                                        right: '30px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        padding: '0 5px'
                                    }}
                                    title="Clear Filter"
                                >✕</button>
                            )}
                        </div>

                        {/* Back Button */}
                        <button className="back-btn-styled" onClick={onBack}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Back to Chat
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="summary-content">
                    <div style={{ maxWidth: '850px', margin: '0 auto' }}>

                        {/* Patient Info Card */}
                        <div className="patient-info-card">
                            <div className="patient-details">
                                <h2>Patient: Devvrat</h2>
                                <p>Diagnosis: Stage 1 Lung Cancer • ID: #PT-2024-89</p>
                            </div>
                            <div className="stat-box">
                                <div className="stat-label">Total Interaction</div>
                                <div className="stat-value">2h 15m</div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="timeline">
                            {filteredSummaries.length === 0 ? (
                                <div className="empty-state">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                    <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No records found</h3>
                                    <p style={{ color: '#94a3b8' }}>Try selecting a different date or clear the filter.</p>
                                    <button
                                        onClick={() => setFilterDate("")}
                                        style={{
                                            marginTop: '1rem',
                                            color: '#3b82f6',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 600
                                        }}
                                    >Clear Filter</button>
                                </div>
                            ) : filteredSummaries.map((item, idx) => (
                                <div key={idx} className="summary-card">
                                    <div className="card-header">
                                        <div className="date-badge">
                                            📅 {item.date}
                                        </div>
                                        <span className={`sentiment-badge ${item.sentiment.toLowerCase()}`}>
                                            {item.sentiment}
                                        </span>
                                    </div>
                                    <h4 className="card-title">{item.title}</h4>
                                    <p className="card-text">{item.summary}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientSummary;
