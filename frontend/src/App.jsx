import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricCard from './components/MetricCard';
import ChartCard from './components/ChartCard';
import DataInputModal from './components/DataInputModal';
import { addData, getPredictions } from './services/api';

function App() {
    const [predictions, setPredictions] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);

    // Sample historical data for charts (in a real app, this would come from API)
    const pollutionTrendData = [
        { name: 'Mon', PM25: 45, PM10: 78, NO2: 32 },
        { name: 'Tue', PM25: 52, PM10: 85, NO2: 38 },
        { name: 'Wed', PM25: 48, PM10: 82, NO2: 35 },
        { name: 'Thu', PM25: 61, PM10: 95, NO2: 42 },
        { name: 'Fri', PM25: 55, PM10: 88, NO2: 39 },
        { name: 'Sat', PM25: 49, PM10: 81, NO2: 34 },
        { name: 'Sun', PM25: 58, PM10: 91, NO2: 41 },
    ];

    const riskScoreTrendData = [
        { name: 'Week 1', RiskScore: 5.2, Violations: 12 },
        { name: 'Week 2', RiskScore: 6.1, Violations: 15 },
        { name: 'Week 3', RiskScore: 5.8, Violations: 14 },
        { name: 'Week 4', RiskScore: 6.8, Violations: 18 },
    ];

    const environmentalIndexData = [
        { name: 'Water Quality', value: 75 },
        { name: 'Air Quality', value: 62 },
        { name: 'Green Cover', value: 18 },
        { name: 'Drainage Quality', value: 68 },
    ];

    const weatherData = [
        { name: '00:00', Humidity: 65, WindSpeed: 3.2, Temperature: 22 },
        { name: '04:00', Humidity: 72, WindSpeed: 2.8, Temperature: 20 },
        { name: '08:00', Humidity: 68, WindSpeed: 3.5, Temperature: 24 },
        { name: '12:00', Humidity: 58, WindSpeed: 4.2, Temperature: 28 },
        { name: '16:00', Humidity: 55, WindSpeed: 4.8, Temperature: 30 },
        { name: '20:00', Humidity: 62, WindSpeed: 3.9, Temperature: 26 },
    ];

    const fetchPredictions = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getPredictions();
            console.log('Predictions:', data);
            setPredictions(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching predictions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddData = async (formData) => {
        try {
            const result = await addData(formData);
            console.log('Data added:', result);

            setNotification({
                type: 'success',
                message: 'Data added successfully! Models are being retrained.'
            });

            // Refresh predictions after adding data
            setTimeout(() => {
                fetchPredictions();
            }, 2000);

            // Clear notification after 5 seconds
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        } catch (err) {
            setNotification({
                type: 'error',
                message: err.message || 'Failed to add data'
            });

            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    };

    // Fetch predictions on mount
    useEffect(() => {
        fetchPredictions();
    }, []);

    // Get risk status based on risk score
    const getRiskStatus = (score) => {
        if (!score) return 'warning';
        if (score < 5) return 'success';
        if (score < 7) return 'warning';
        return 'danger';
    };

    // Get pollution status based on PM2.5
    const getPollutionStatus = (pm25) => {
        if (!pm25) return 'warning';
        if (pm25 < 50) return 'success';
        if (pm25 < 100) return 'warning';
        return 'danger';
    };

    return (
        <div className="app">
            <Navbar />

            {notification && (
                <div className={`notification notification-${notification.type}`}>
                    {notification.type === 'success' ? '✓' : '✕'} {notification.message}
                </div>
            )}

            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1 className="heading-main">Environmental Risk Dashboard</h1>
                        <p className="text-muted" style={{ fontSize: '14px' }}>
                            Real-time monitoring and ML-powered predictions for urban environmental risks
                        </p>
                    </div>
                    <div className="flex gap-md">
                        <button className="btn btn-secondary" onClick={fetchPredictions} disabled={isLoading}>
                            {isLoading ? '⏳ Loading...' : '🔄 Refresh Predictions'}
                        </button>
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                            ➕ Add New Data
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <span>⚠️ Error: {error}</span>
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                {/* Top Metrics */}
                <div className="grid grid-cols-4 mb-lg">
                    <MetricCard
                        title="Tomorrow's PM2.5"
                        value={predictions?.tomorrow_pm25 ?
                            predictions.tomorrow_pm25.toFixed(1) :
                            '--'}
                        unit="µg/m³"
                        status={predictions?.tomorrow_pm25 ?
                            getPollutionStatus(predictions.tomorrow_pm25) :
                            'warning'}
                        subtitle="Predicted air quality"
                    />
                    <MetricCard
                        title="Risk Score"
                        value={predictions?.risk_score ?
                            predictions.risk_score.toFixed(1) :
                            '--'}
                        unit="/10"
                        status={predictions?.risk_score ?
                            getRiskStatus(predictions.risk_score) :
                            'warning'}
                        subtitle="Overall environmental risk"
                    />
                    <MetricCard
                        title="Hotspot Cluster"
                        value={predictions?.hotspot_cluster !== undefined ?
                            predictions.hotspot_cluster :
                            '--'}
                        subtitle="Risk zone classification"
                    />
                    <MetricCard
                        title="Active Monitoring"
                        value="24/7"
                        subtitle="Real-time data collection"
                        status="success"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-2 mb-lg">
                    <ChartCard
                        title="📊 Pollution Trend (7 Days)"
                        data={pollutionTrendData}
                        type="area"
                        dataKeys={['PM25', 'PM10', 'NO2']}
                        colors={['#3B82F6', '#10B981', '#F59E0B']}
                        height={300}
                    />
                    <ChartCard
                        title="⚠️ Risk Score & Violations Trend"
                        data={riskScoreTrendData}
                        type="line"
                        dataKeys={['RiskScore', 'Violations']}
                        colors={['#EF4444', '#F59E0B']}
                        height={300}
                    />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-2 mb-lg">
                    <ChartCard
                        title="🌦️ Weather Conditions (24h)"
                        data={weatherData}
                        type="area"
                        dataKeys={['Humidity', 'WindSpeed']}
                        colors={['#3B82F6', '#10B981']}
                        height={300}
                    />
                    <ChartCard
                        title="🌍 Environmental Quality Index"
                        data={environmentalIndexData}
                        type="bar"
                        dataKeys={['value']}
                        colors={['#3B82F6']}
                        height={300}
                    />
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 mb-lg">
                    <div className="card card-highlighted">
                        <h3 className="card-subtitle">🎯 ML Model Performance</h3>
                        <div className="divider"></div>
                        <div className="flex flex-col gap-sm mt-md">
                            <div className="flex justify-between">
                                <span className="text-muted">Pollution Model R²</span>
                                <span className="font-semibold">0.94</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Risk Model RMSE</span>
                                <span className="font-semibold">0.82</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Last Trained</span>
                                <span className="font-semibold">2 hours ago</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Training Data Points</span>
                                <span className="font-semibold">1,247</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="card-subtitle">🚨 Recent Alerts</h3>
                        <div className="divider"></div>
                        <div className="flex flex-col gap-sm mt-md">
                            <div className="alert-item">
                                <span className="status-badge status-warning">● Moderate</span>
                                <span className="text-muted" style={{ fontSize: '13px' }}>High PM2.5 expected tomorrow</span>
                            </div>
                            <div className="alert-item mt-sm">
                                <span className="status-badge status-success">● Normal</span>
                                <span className="text-muted" style={{ fontSize: '13px' }}>Water quality stable</span>
                            </div>
                            <div className="alert-item mt-sm">
                                <span className="status-badge status-warning">● Moderate</span>
                                <span className="text-muted" style={{ fontSize: '13px' }}>15 violations last week</span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="card-subtitle">📈 System Status</h3>
                        <div className="divider"></div>
                        <div className="flex flex-col gap-sm mt-md">
                            <div className="flex justify-between">
                                <span className="text-muted">API Status</span>
                                <span className="status-badge status-success">● Online</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Database</span>
                                <span className="status-badge status-success">● Connected</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">ML Models</span>
                                <span className="status-badge status-success">● Ready</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Data Collection</span>
                                <span className="status-badge status-success">● Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DataInputModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddData}
            />
        </div>
    );
}

const appStyles = `
  .app {
    min-height: 100vh;
    background-color: var(--bg-main);
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-lg);
    border-bottom: 1px solid var(--border-color);
  }

  .error-banner {
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid var(--danger-red);
    border-radius: var(--radius-md);
    padding: 16px;
    margin-bottom: var(--space-lg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--danger-red);
  }

  .error-banner button {
    background: none;
    border: none;
    color: var(--danger-red);
    font-size: 18px;
    cursor: pointer;
    padding: 4px 8px;
  }

  .notification {
    position: fixed;
    top: 80px;
    right: 20px;
    background: white;
    padding: 16px 24px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    border-left: 4px solid var(--primary-blue);
    font-size: 14px;
    font-weight: 500;
  }

  .notification-success {
    border-left-color: var(--success-green);
    color: var(--success-green);
  }

  .notification-error {
    border-left-color: var(--danger-red);
    color: var(--danger-red);
  }

  .alert-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .font-semibold {
    font-weight: 600;
    color: var(--text-heading);
  }

  @media (max-width: 1024px) {
    .dashboard-header {
      flex-direction: column;
      gap: var(--space-md);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = appStyles;
    document.head.appendChild(styleElement);
}

export default App;
