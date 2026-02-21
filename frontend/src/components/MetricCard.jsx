import React from 'react';

const MetricCard = ({ title, value, unit, growth, status, subtitle }) => {
    const getStatusClass = () => {
        if (status === 'success') return 'status-success';
        if (status === 'warning') return 'status-warning';
        if (status === 'danger') return 'status-danger';
        return '';
    };

    const getGrowthClass = () => {
        if (!growth) return '';
        return growth > 0 ? 'positive' : 'negative';
    };

    return (
        <div className="card animate-slide-in">
            <div className="card-title">{title}</div>
            <div className="card-value">
                {value}
                {unit && <span style={{ fontSize: '20px', marginLeft: '4px', color: 'var(--text-muted)' }}>{unit}</span>}
            </div>
            {subtitle && (
                <div className="text-muted mb-sm">{subtitle}</div>
            )}
            {growth !== undefined && (
                <div className={`metric-growth ${getGrowthClass()}`}>
                    {growth > 0 ? '↑' : '↓'} {Math.abs(growth)}%
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>
                        vs last week
                    </span>
                </div>
            )}
            {status && (
                <div className="mt-sm">
                    <span className={`status-badge ${getStatusClass()}`}>
                        {status === 'success' && '● Normal'}
                        {status === 'warning' && '● Moderate'}
                        {status === 'danger' && '● High Risk'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default MetricCard;
