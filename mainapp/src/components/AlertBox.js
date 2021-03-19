import React from 'react';


export function AlertBox({ alertBox, setAlertBox }) {

    return (
        <div className='alert-box'>
            <p>{alertBox}</p>
            <button onClick={setAlertBox(false)}>x</button>
        </div>
    )
}