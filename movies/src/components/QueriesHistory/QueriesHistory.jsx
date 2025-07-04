import { useState, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux';
import { getResolved, setPending, setResolved } from '../../Slices/ResolveSlice';
import { NotificationContext } from '../../Context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const QueriesHistory = () => {
    const [data,setData] = useState([]);
    const dispatch = useDispatch()
    const {msg} = useContext(NotificationContext)
    const navigate = useNavigate()

    const getQueries = async () => {
        try{
            const response = await fetch('http://localhost:3000/queries/getQueries')
            const data = await response.json()
            console.log(data)
            setData(data.list)
        }
        catch(err){
            console.log(err)
            alert('Something went Wrong!')
        }
    }

    useEffect(()=>{
        getQueries()
    },[])

    useEffect(()=>{
        getQueries()
    },[msg])

    useEffect(()=>{
        dispatch(setPending(data.length))
    },[data])

    const handleResolve = async (details) => {
        const {_id} = details;
        const opt = confirm('Are you sure? You Resolved that?')
        if(!opt){
            return;
        }
        try{
            const response = await dispatch(setResolved(_id)).unwrap()
            console.log(response)
            if(response.status === 'success'){
                dispatch(getResolved())
                getQueries()
            }
        }
        catch(err){
            console.log(err)
            alert(err)
        }
    }  

    return (
        <div className='home-cont'>
            <table className='query-table'>
                <thead>
                    <th>User</th>
                    <th>Query</th>
                    <th>Reported</th>
                    <th>Status</th>
                    <th>Actions</th>
                    <th>Resolved</th>
                </thead>
                <tbody>
                    {
                        data && data.map((el,index)=>(
                            <tr className={el.resolved?'resolved':'problem'} key={index}>
                                <td>{el.username}</td>
                                <td>{el.query}</td>
                                <td>{new Date(el.date).toLocaleDateString()}</td>
                                <td>{el.resolved ? 'Yes' : 'No'}</td>
                                <td><button className='act' disabled={el.resolved} onClick={()=>handleResolve(el)}>{!el.resolved && 'Resolved ?' || 'Solved'}</button></td>
                                <td onClick={()=>navigate('/queriesAd',{state: {name: el.username}})}>{el.resolved ? new Date(el.resolvedOn).toLocaleDateString() : 'Pending'}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default QueriesHistory