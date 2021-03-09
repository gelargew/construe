import React, { useEffect, useRef } from 'react'


export function RentBox({hideBox}) {
    
    return (
        <div className='rentbox' >
            <p className='button-exit' onClick={hideBox}>X</p>
        </div>
    )
}