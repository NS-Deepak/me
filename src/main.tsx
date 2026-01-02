import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../st';

const mountElement = document.getElementById('threejs-mount');
if (mountElement) {
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100vh';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.zIndex = '0';
    mountElement.appendChild(container);

    const reactRoot = createRoot(container);
    reactRoot.render(React.createElement(App));
}
