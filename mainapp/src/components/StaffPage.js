import React, { useEffect, useState } from 'react';


export function StaffPage() {
    const [orders, setOrders] = useState([])
    useEffect(async () => {
        const res = await fetch('api/contracts/')
        const data = await res.json()

        console.log(data)
    }, [])
    return (
        <div className='staff-page'>
            <h3>Transactions</h3>
            <div>

            </div>
        </div>
    )
}