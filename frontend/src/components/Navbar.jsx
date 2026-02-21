import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="flex items-center justify-between" style={{ padding: '0' }}>
                    <div className="flex items-center gap-lg">
                        <h1 className="heading-main" style={{ marginBottom: 0 }}>
                            🌍 Urban Risk Prediction
                        </h1>
                        <div className="flex items-center gap-md">
                            <button className="btn btn-secondary">
                                <span>➕</span> Add Data
                            </button>
                            <button className="btn btn-secondary">
                                <span>🔄</span> Refresh
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-md">
                        <button className="btn btn-secondary tooltip" data-tooltip="Full Screen">
                            <span>⛶</span>
                        </button>
                        <button className="btn btn-secondary tooltip" data-tooltip="Share Dashboard">
                            <span>↗</span>
                        </button>
                        <div className="avatar">
                            UR
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const navbarStyles = `
  .navbar {
    background-color: white;
    border-bottom: 1px solid var(--border-color);
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.95);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = navbarStyles;
    document.head.appendChild(styleElement);
}

export default Navbar;
