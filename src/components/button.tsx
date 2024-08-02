import React, { useEffect, useState } from 'react';
import cockpit from 'cockpit';
import { BackgroundImage } from '@patternfly/react-core';


export function StartServerButton({ disabled }: { disabled: boolean }) {
    const [loading, setLoading] = useState(false);
    const buttonClass = `pf-v5-c-button ${disabled || loading ? 'pf-m-secondary' : 'pf-m-primary'}`;

    const startServer = async () => {
        setLoading(true);

        try {
            const command = ['bash', '-c', 'systemctl start allthemods9'];
            cockpit.spawn(command)
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                });
        } catch (error) {
            console.error('Error starting server:', error);
        }

        setLoading(false);
    };

    return (
        <button onClick={startServer} disabled={disabled || loading} className={buttonClass}>
            {loading ? 'Starting server...' : 'Start server'}
        </button>
    );
}

export function StopServerButton({ disabled }: { disabled: boolean }) {
    const [loading, setLoading] = useState(false);
    const buttonClass = `pf-v5-c-button ${disabled || loading ? 'pf-m-secondary' : 'pf-m-primary'}`;
    const buttonStyle = {
        active: {
            backgroundColor: 'red'
        },
        disabled: {
            backgroundColor: 'darkred',
            cursor: 'not-allowed',
            opacity: 0.5
        }
    }

    const stopServer = async () => {
        setLoading(true);

        try {
            const command = ['bash', '-c', 'systemctl stop allthemods9'];
            cockpit.spawn(command)
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                });
        } catch (error) {
            console.error('Error stopping server:', error);
        }

        setLoading(false);
    };

    return (
        // <button onClick={stopServer} disabled={disabled || loading} className={buttonClass} style={{ backgroundColor: 'red' }}>
        <button onClick={stopServer} disabled={disabled || loading} className={buttonClass} style={disabled ? buttonStyle.disabled : buttonStyle.active}>
            {loading ? 'Stopping server...' : 'Stop server'}
        </button>
    );
}

export function RestartServerButton({ disabled }: { disabled: boolean }) {
    const [loading, setLoading] = useState(false);
    const buttonClass = `pf-v5-c-button ${disabled || loading ? 'pf-m-secondary' : 'pf-m-primary'}`;

    const restartServer = async () => {
        setLoading(true);

        try {
            const command = ['bash', '-c', 'systemctl restart allthemods9'];
            cockpit.spawn(command)
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                });
        } catch (error) {
            console.error('Error restarting server:', error);
        }

        setLoading(false);
    };

    return (
        <button onClick={restartServer} disabled={disabled || loading} className={buttonClass}>
            {loading ? 'Restarting server...' : 'Restart server'}
        </button>
    );
}