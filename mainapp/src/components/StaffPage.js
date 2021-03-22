import React, { useEffect, useState } from 'react';
import { Contract } from './Contract';


export function StaffPage({user}) {
    const [contracts, setContracts] = useState([])
    const [reload, setReload] = useState(0)    
    
    const getContracts = async () => {
        const res = await fetch('api/contracts/')
        const data = await res.json()
        setContracts(data)
        console.log(data)  
    }
    
    useEffect(() => {
        getContracts()
        let interval = setInterval(getContracts, 20000)      
        return () => clearInterval(interval)
    }, [reload])

    return (
        <div className='staff-page'>
            <h3>orders</h3>
            {contracts.count ?                              
                <div>
                    {contracts.results.map(contract => {
                        return <Contract key={contract.id} contract={contract} user={user} setReload={setReload} />
                    })}
                </div>:
                <p>nothing to see here</p>
            }
        </div>
    )
}