import React, { useState } from 'react';
import { message, Tooltip } from 'antd';

export default function Spoiler({ text }) {
    const [hovering, setHovering] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => {
                message.success('Copied key to clipboard.');
                navigator.clipboard.writeText(text);
            }}
            style={
                hovering ? {
                    transitionDuration: '0.2s',
                    cursor: 'pointer',
                } : {
                    transitionDuration: '0.2s',
                    cursor: 'pointer',
                    filter: 'blur(4px)',
                }
            }
        >
            <Tooltip
                placement="bottom"
                color="#2b2b2b"
                title="Click to copy your key"
            >
                {text}
            </Tooltip>
        </div>
    );
}
