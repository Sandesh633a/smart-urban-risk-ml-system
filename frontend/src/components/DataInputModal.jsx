import React, { useState } from 'react';

const DataInputModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        city_id: 1,
        zone_id: 1,
        date: new Date().toISOString().split('T')[0],
        pm25: '',
        pm10: '',
        no2: '',
        pollution_trend_3days: '',
        humidity: '',
        wind_speed: '',
        rainfall_last_3_days: '',
        water_quality_index: '',
        reservoir_level: '',
        violations_last_7_days: '',
        avg_violation_severity: '',
        repeat_offender_rate: '',
        population_density: '',
        industrial_density: '',
        green_cover_percentage: '',
        drainage_quality_index: '',
        social_vulnerability_index: '',
        risk_score: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Convert string values to numbers
        const processedData = Object.entries(formData).reduce((acc, [key, value]) => {
            if (key === 'date') {
                acc[key] = value;
            } else if (key === 'city_id' || key === 'zone_id') {
                acc[key] = parseInt(value);
            } else {
                acc[key] = parseFloat(value);
            }
            return acc;
        }, {});

        try {
            await onSubmit(processedData);
            onClose();
            // Reset form
            setFormData({
                city_id: 1,
                zone_id: 1,
                date: new Date().toISOString().split('T')[0],
                pm25: '',
                pm10: '',
                no2: '',
                pollution_trend_3days: '',
                humidity: '',
                wind_speed: '',
                rainfall_last_3_days: '',
                water_quality_index: '',
                reservoir_level: '',
                violations_last_7_days: '',
                avg_violation_severity: '',
                repeat_offender_rate: '',
                population_density: '',
                industrial_density: '',
                green_cover_percentage: '',
                drainage_quality_index: '',
                social_vulnerability_index: '',
                risk_score: ''
            });
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="heading-main">Add Environmental Data</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-grid">
                        <div className="form-section">
                            <h3 className="form-section-title">📍 Location</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City ID</label>
                                    <input
                                        type="number"
                                        name="city_id"
                                        value={formData.city_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Zone ID</label>
                                    <input
                                        type="number"
                                        name="zone_id"
                                        value={formData.zone_id}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">🌫️ Air Quality</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>PM2.5 (µg/m³)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="pm25"
                                        value={formData.pm25}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 45.5"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>PM10 (µg/m³)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="pm10"
                                        value={formData.pm10}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 78.2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>NO2 (ppb)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="no2"
                                        value={formData.no2}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 32.1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pollution Trend (3 days)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="pollution_trend_3days"
                                        value={formData.pollution_trend_3days}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 1.5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">🌦️ Weather</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Humidity (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="humidity"
                                        value={formData.humidity}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 65.5"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Wind Speed (m/s)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="wind_speed"
                                        value={formData.wind_speed}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 3.2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rainfall Last 3 Days (mm)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="rainfall_last_3_days"
                                        value={formData.rainfall_last_3_days}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 12.5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">💧 Water Quality</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Water Quality Index</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="water_quality_index"
                                        value={formData.water_quality_index}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 75.0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Reservoir Level (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="reservoir_level"
                                        value={formData.reservoir_level}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 82.3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">⚠️ Violations</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Violations Last 7 Days</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="violations_last_7_days"
                                        value={formData.violations_last_7_days}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 15"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Avg Violation Severity</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="avg_violation_severity"
                                        value={formData.avg_violation_severity}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 3.5"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Repeat Offender Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="repeat_offender_rate"
                                        value={formData.repeat_offender_rate}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 22.5"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">🏙️ Urban Characteristics</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Population Density</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="population_density"
                                        value={formData.population_density}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 8500"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Industrial Density</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="industrial_density"
                                        value={formData.industrial_density}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 45.2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Green Cover (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="green_cover_percentage"
                                        value={formData.green_cover_percentage}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 18.5"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Drainage Quality Index</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="drainage_quality_index"
                                        value={formData.drainage_quality_index}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 62.0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3 className="form-section-title">📊 Risk Assessment</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Social Vulnerability Index</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="social_vulnerability_index"
                                        value={formData.social_vulnerability_index}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 4.2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Risk Score</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="risk_score"
                                        value={formData.risk_score}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., 6.8"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? '⏳ Submitting & Training...' : '✓ Submit & Train Models'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const modalStyles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
  }

  .modal-header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    border-radius: 16px 16px 0 0;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-muted);
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: var(--bg-main);
    color: var(--text-heading);
  }

  .modal-body {
    padding: 24px;
  }

  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-section {
    background: var(--bg-main);
    padding: 20px;
    border-radius: 12px;
  }

  .form-section-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-heading);
    margin-bottom: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-normal);
  }

  .form-group input {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 14px;
    font-family: var(--font-family);
    transition: all 0.2s;
    background: white;
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--primary-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    position: sticky;
    bottom: 0;
    background: white;
    border-radius: 0 0 16px 16px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = modalStyles;
    document.head.appendChild(styleElement);
}

export default DataInputModal;
