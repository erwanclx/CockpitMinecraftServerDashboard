import React, { useEffect, useState } from 'react';
import cockpit from 'cockpit';
import { Popover, Button, List, ListItem } from '@patternfly/react-core';
import { env } from '../../config.js';

export function ServiceStatus({ onStatusChange }: { onStatusChange: any }) {
    const [status, setStatus] = useState('Loading...');
    const [playerNumber, setPlayerNumber] = useState(0);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const fetchStatus = () => {
            cockpit.spawn(['systemctl', 'show', '-p', 'ActiveState', 'allthemods9'])
                .done(data => {
                    const trimmedStatus = data.split('=')[1].trim();
                    setStatus(trimmedStatus);
                    onStatusChange(trimmedStatus);
                })
                .fail(error => {
                    setStatus(`Error: ${error}`);
                    console.error('Error fetching service status:', error);
                });
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 500);
        return () => clearInterval(interval);
    }, [onStatusChange]);

    useEffect(() => {
        const fetchPlayers = () => {
            fetch(`${env.REACT_APP_RCON_URL}/mc/getPlayers`)
                .then(response => response.json())
                .then(data => {
                    if (data.players[0] === "") {
                        setPlayerNumber(0);
                        setPlayers([]);
                    } else {
                        setPlayerNumber(data.players.length);
                        setPlayers(data.players);
                    }
                    setMaxPlayers(data.maxPlayers);
                })
                .catch(error => {
                    console.error('Error fetching players:', error);
                });
        };

        fetchPlayers();
        const interval = setInterval(fetchPlayers, 10000);
        return () => clearInterval(interval);
    }, []);

    const statusCorrespondance: { [key: string]: { display: string; color: string } } = {
        'active': {
            display: 'Running',
            color: 'green'
        },
        'inactive': {
            display: 'Stopped',
            color: 'red'
        },
        'unknown': {
            display: 'Unknown',
            color: 'yellow'
        },
        'Error': {
            display: 'Error',
            color: 'gray'
        }
    }

    const statusInfo = statusCorrespondance[status] || statusCorrespondance['unknown'];

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>Service Status: <span style={{ color: statusInfo.color }}>{statusInfo.display}</span></h1>
            {maxPlayers != 0 && <h2>Players: {playerNumber}/{maxPlayers} <Popover aria-label="Players popover"
                headerContent={<div>Actual players</div>}
                bodyContent={<List>
                    {players.map((player: string, index: number) => <ListItem key={index}>{player}</ListItem>)}
                </List>}
            ><Button>See players</Button>
            </Popover> </h2>}
        </div>
    );
}
