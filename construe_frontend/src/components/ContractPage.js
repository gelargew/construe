import React, { useContext, useEffect, useState } from 'react'
import { baseUrl, userContext } from './App'
import { getCsrf } from './Auth'


export const ContractPage = () => {
    const {user} = useContext(userContext)
    const [contracts, setContracts] = useState({results: []})
    const [url, setUrl] = useState(`${baseUrl}/api/contracts/`)

    useEffect(async () => {
        const response = await fetch(url)
        const data = await response.json()      
        setContracts(data)
    }, [url])

    return (
        <div className='contract-page'>
            <h3>{user.is_staff ? 'Contracts' : 'My Books'}</h3>

            <ul>
                {contracts.results.map((contract, idx) => 
                <Contract key={contract.id} contract={contract} idx={idx} setContracts={setContracts} />)}
            </ul>
            
            {contracts.count > 20 &&
            <>
                <button onClick={() => setUrl(contracts.previous)} disabled={!contracts.previous}>
                    <i className="fas fa-caret-left fa-2x"></i>
                </button>

                <button onClick={() => setUrl(contracts.next)} disabled={!contracts.next}>
                    <i className="fas fa-caret-right fa-2x"></i>
                </button>
            </>}
            <small>{contracts.results.length} of {contracts.count}</small>
        </div>
    )
}


const Contract = ({contract, idx, setContracts}) => {
    const {user, setUser} = useContext(userContext)

    const handleContract = async e => {
        const response = await fetch(`${baseUrl}/api/contract/${contract.id}/${e.target.value}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'X-CSRFToken': getCsrf()
            },
            body: JSON.stringify({status: e.target.value})
        })
        if (response.status === 200) {
            const data = await response.json()
            setContracts(prev => {
                if (data.status === 'returned' || data.status === 'cancelled') {
                    prev.results.splice(idx, 1)
                    prev.count -= 1
                    setUser({...user, contracts: user.contracts.filter(ele => ele != data.book.id)})
                }
                else prev.results[idx] = data
                return {...prev}
            })
        }
    }

    return (
        <li>
            <span>{contract.book.title} <small>user: {contract.user}</small></span>
            <small>status: {contract.status} until: {contract.expiry}</small>
            <span>
                {user.is_staff && contract.status === 'waiting' && 
                <button value='active' onClick={handleContract}>Accept</button>}
                
                {user.is_staff && contract.status === 'active' && 
                <button value='returned' onClick={handleContract}>Retrieve</button>}
                
                {contract.status === 'waiting' && user.is_staff &&
                <button value='cancelled' onClick={handleContract}>Cancel</button>}
            </span>
        </li>
    )

}