import React, { useEffect, useState } from 'react';
import * as serviceWorker from '../../serviceWorkerRegistration';
import './ServiceWorkerWrapper.css';

const ServiceWorkerWrapper = () => {
    const [showReload, setShowReload] = useState(false);
    const [waitingWorker, setWaitingWorker] = useState(null);

    const onSWUpdate = (registration) => {
        setShowReload(true);
        setWaitingWorker(registration.waiting);
    };

    useEffect(() => {
        serviceWorker.register({ onUpdate: onSWUpdate });
    }, []);

    const reloadPage = () => {
        waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
        setShowReload(false);
        window.location.reload(true);
    };

    return (
        <>
            {
                (showReload) ? (
                    <div className='serviceWNotification'>
                        <h1>{'¡Nueva version disponible!'}</h1>
                        <button onClick={reloadPage}>Recargar</button>
                    </div>
                ):(
                    ''
                )
            }
        </>
    )
}

export default ServiceWorkerWrapper;