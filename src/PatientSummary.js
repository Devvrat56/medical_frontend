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
            <div className="chat-window desktop">
                {/* HEADER */}
                <div className="chat-header" style={{ justifyContent: 'space-between' }}>
                    <div className="header-info">
                        <div className="bot-avatar" style={{ background: '#8b5cf6', boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                        </div>
                        <div className="header-text">
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Patient Summary</h3>
                            <div className="status-badge" style={{ background: '#dbeafe', color: '#2563eb' }}>Dr. View</div>
                        </div>
                    </div>

                    <div className="header-controls" style={{ gap: '12px' }}>
                        {/* Styled Date Picker */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="date"
                                className="styled-date-input"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    color: '#475569',
                                    background: '#fff',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer'
                                }}
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

                        {/* Styled Back Button */}
                        <button
                            className="back-btn"
                            onClick={onBack}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                                transition: 'transform 0.1s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                            onMouseOut={(e) => e.target.style.transform = 'none'}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                            Back to Chat
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="summary-content" style={{ padding: '2rem', overflowY: 'auto', background: '#f8fafc', height: '100%' }}>
                    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.8rem' }}>Patient: Devvrat</h2>
                                <p style={{ margin: '5px 0 0', color: '#64748b' }}>Diagnosis: Stage 1 Lung Cancer • ID: #PT-2024-89</p>
                            </div>
                            <div style={{
                                padding: '10px 20px',
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Interaction Time</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>2h 15m</div>
                            </div>
                        </div>

                        <div className="timeline">
                            {filteredSummaries.length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '4rem',
                                    background: 'white',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                                }}>
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
                                <div key={idx} className="summary-card" style={{
                                    background: 'white',
                                    padding: '1.75rem',
                                    borderRadius: '16px',
                                    marginBottom: '1.25rem',
                                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
                                    borderLeft: '5px solid #8b5cf6',
                                    transition: 'transform 0.2s',
                                    cursor: 'default'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                background: '#f1f5f9',
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                color: '#475569',
                                                fontSize: '0.85rem'
                                            }}>📅 {item.date}</span>
                                        </div>
                                        <span style={{
                                            fontSize: '0.85rem',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            background: item.sentiment === 'Anxious' ? '#fef2f2' : item.sentiment === 'Worried' ? '#fff7ed' : '#f0fdf4',
                                            color: item.sentiment === 'Anxious' ? '#ef4444' : item.sentiment === 'Worried' ? '#f97316' : '#16a34a',
                                            fontWeight: '600'
                                        }}>{item.sentiment}</span>
                                    </div>
                                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', color: '#1e293b' }}>{item.title}</h4>
                                    <p style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontSize: '1rem' }}>{item.summary}</p>
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
