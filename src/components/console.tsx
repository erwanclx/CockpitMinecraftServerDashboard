import React, { useEffect, useState } from 'react';
import cockpit from 'cockpit';

import { env } from '../../config.js';

export function Console() {
    const [command, setCommand] = useState('');
    const [history, setHistory] = useState<{ type: string; text: string; }[]>([]);

    useEffect(() => {
        const console = document.querySelector('div[style*="height: 300px"]');
        if (console) {
            console.scrollTop = console.scrollHeight;
        }
    }, [history]);

    const sendCommand = async () => {
        if (!command.trim()) return;

        setHistory((prevHistory) => [...prevHistory, { type: 'command', text: command }]);
        setCommand('');

        try {
            const res = await fetch(`${env.REACT_APP_RCON_URL}/rcon`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command }),
            });
            const data = await res.json();
            setHistory((prevHistory) => [...prevHistory, { type: 'response', text: data.response }]);
        } catch (error) {
            console.error('Error sending RCON command:', error);
            setHistory((prevHistory) => [...prevHistory, { type: 'error', text: 'Error sending RCON command' }]);
        }
    };

    const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendCommand();
        }
    };
    return (
        <div style={{ backgroundColor: 'black', color: 'white', padding: '10px', fontFamily: 'monospace', marginTop: '20px' }}>
            <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
                {history.map((item, index) => (
                    <div key={index} style={{ color: item.type === 'command' ? 'yellow' : item.type === 'response' ? 'green' : 'red' }}>
                        {item.text ? "> " + item.text : ''}
                    </div>
                ))}
            </div>
            <textarea
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{ width: '100%', backgroundColor: 'black', color: 'white', border: 'none', outline: 'none', resize: 'none' }}
                placeholder="Enter RCON command"
            />
        </div>
    );
}

export function LogsConsole() {
    const [logs, setLogs] = useState<string[]>([]);
    const [seenLogs, setSeenLogs] = useState<string[]>([]);

    useEffect(() => {
        const fetchLogs = () => {
            cockpit.spawn(['journalctl', '-u', 'allthemods9.service', '-n', '100', '-o', 'cat'])
                .done(data => {
                    const newLogs = data.split('\n').filter(Boolean).filter(log => !log.includes('Thread RCON Client'));
                    // const newLogs = data.split('\n').filter(Boolean)
                    const unseenLogs = newLogs.filter(log => !seenLogs.includes(log));
                    if (unseenLogs.length > 0) {
                        setLogs(prevLogs => [...prevLogs, ...unseenLogs]);
                        setSeenLogs(prevSeenLogs => [...prevSeenLogs, ...unseenLogs]);
                    }
                })
                .fail(error => {
                    console.error('Error fetching logs:', error);
                });
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 500);
        return () => clearInterval(interval);
    }, [seenLogs]);

    useEffect(() => {
        const consoleElement = document.querySelectorAll('div[style*="height: 300px"]')[1];
        if (consoleElement) {
            consoleElement.scrollTop = consoleElement.scrollHeight;
        }
    }, [logs]);

    return (
        <div style={{ backgroundColor: 'black', color: 'white', padding: '10px', fontFamily: 'monospace', marginTop: '20px' }}>
            <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
                {logs.map((log, index) => (
                    <div key={index} style={{ color: 'white' }}>
                        {formatLog(log)}
                    </div>
                ))}
            </div>
            <button
                onClick={() => setLogs([])}
                style={{ backgroundColor: 'black', color: 'white', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
                Clear
            </button>
        </div>
    );
}

function formatLog(log: string) {
    const timestampRegex = /^\[\d{2}:\d{2}:\d{2}\]/;
    const match = log.match(timestampRegex);

    if (match) {
        const timestampPart = match[0];
        const messagePart = log.slice(timestampPart.length);
        return (
            <>
                <span style={{ color: 'cyan' }}>{timestampPart}</span>
                <span>{messagePart}</span>
            </>
        );
    } else {
        return <span>{log}</span>;
    }
}