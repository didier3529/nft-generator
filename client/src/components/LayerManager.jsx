import React, { useState } from 'react';

// Simple version without drag-and-drop
const LayerManager = () => {
    const [layers] = useState([
        'Background',
        'Body',
        'Eyes',
        'Mouth'
    ]);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc' }}>
            <h2>Layer Manager</h2>
            <ul>
                {layers.map((layer, index) => (
                    <li 
                        key={layer}
                        style={{
                            padding: '10px',
                            margin: '5px 0',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ddd'
                        }}
                    >
                        {layer}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Make sure to export the component
export default LayerManager; 