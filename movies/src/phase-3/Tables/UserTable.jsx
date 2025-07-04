import { useState, useEffect } from 'react'

const UserTable = () => {
    const [usersList,setUsersList] = useState([])

    useEffect(()=>{
        const doFirst = async () => {
            try{
                const response = await fetch('http://localhost:3000/revenueByUser');
                const data = await response.json()
                if(data.status === 'success'){
                    setUsersList(data.list)
                }
                else{
                    alert('Failed to Fetch from Server')
                }
            }
            catch(err){
                console.log(err)
                alert('Something went Wrong!')
            }
        }
        doFirst()
    },[])

    return (
        <div className='add-t'>
            <div style={{display: "flex", flexDirection: "row"}}>
                <table className='ticket-table'>
                    <thead>
                        <th>User</th>
                        <th>Spent</th>
                    </thead>
                    <tbody>
                        {
                            usersList.map((el,index)=>(
                                <tr key={index}>
                                    <td>{el._id}</td>
                                    <td style={{color: "lime"}}>{el.spent}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserTable