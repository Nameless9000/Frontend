import { message, Tooltip } from 'antd';
import React, { useState } from 'react';
import styles from '../styles/main.module.css';

export default function Spoiler({ text }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={styles.fadeInEffect}
      onClick={() => {
        message.success('Copied key to clipboard.');
        navigator.clipboard.writeText(text);
      }}
      style={hovering ? null : { filter: 'blur(4px)' }}
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
