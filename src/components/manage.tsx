import React from 'react';
import { StartServerButton, StopServerButton, RestartServerButton } from './button';
import { Divider } from '@patternfly/react-core';

export default function Manage(status: any) {
    let serviceStatus = status.status;

    return (
        <div>
            <Divider />
            <h1>Manage Server</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
                <StartServerButton disabled={serviceStatus === 'Loading...' || serviceStatus === 'active'} />
                <StopServerButton disabled={serviceStatus === 'Loading...' || serviceStatus !== 'active'} />
                <RestartServerButton disabled={serviceStatus === 'Loading...' || serviceStatus === 'active'} />
            </div>
        </div>
    );
}