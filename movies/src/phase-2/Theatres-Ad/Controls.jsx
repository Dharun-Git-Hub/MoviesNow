import { useState, useEffect } from 'react'
import Addd from './Add'
import { loadTheatres } from '../../Slices/TheatreSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UpdateTheatre from './Update';

const ControlsT = () => {
    const [theatres,setTheatres] = useState([])
    const [updateMovie,setUpdateMovie] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(()=>{
        const doFirst = async () => {
            const theatresList = await dispatch(loadTheatres()).unwrap()
            setTheatres(theatresList.list)
        }
        doFirst()
    },[])

    const Remove = () => {
        const [theatre,setTheatre] = useState('');
        
        const handleRemove = async() => {
            const opt = confirm('Are you sure to Delete Theatre?')
            if(opt === false)
                return
            if(theatre.trim() != ''){
                const exist = theatres.find((el)=>el.name === theatre)
                if(exist){
                    try{
                        const response = await fetch('http://localhost:3000/removeTheatre',{
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({name: theatre}),
                        })
                        const data = await response.json()
                        console.log(data)
                        if(data.status === 'success'){
                            alert(data.message)
                            setTheatre('')
                            const newTheatres = await dispatch(loadTheatres()).unwrap()
                            setTheatres(newTheatres.list)
                            return
                        }
                        else{
                            alert(data.messagge)
                            return
                        }
                    }
                    catch(err){
                        console.log(err)
                        alert('Something Went Wrong!')
                        return
                    }
                }
                else{
                    alert(`Theatre ${theatre} not found!`)
                    return
                }
            }
            else{
                alert('Select a Theatre to Remove')
                return
            }
        }
        return (
            <div style={{marginTop: "20px"}} className='add-t'>
                <datalist id="dt-list-theatre">
                    {
                        theatres.map((el,index)=>(
                            <option key={index} value={el.name}>{el.name}</option>
                        ))
                    }
                </datalist>
                <input placeholder='Remove Theatre' onChange={(e)=>setTheatre(e.target.value)} list="dt-list-theatre"/>
                <button style={{background: "orangered", color: "#fff"}} type="submit" onClick={handleRemove}>Remove</button>
            </div>
        )
    }

    return (
        <div className='controls-main'>
            <Addd setTheatres={setTheatres}/>
            <Remove/>
            <div className='add-t' style={{marginTop: "20px"}}>
                <span className='trend-desc'>Update Theatre</span>
            <input list='dt-list-theatre' placeholder='Update Theatre' onChange={(e)=>setUpdateMovie(e.target.value)}/>
            <datalist>
                {
                    theatres.map((el,index)=>(
                        <option key={index} value={el.name}>{el.name}</option>
                    ))
                }
            </datalist>
            {
                updateMovie.trim() != '' && (
                    <UpdateTheatre name={updateMovie} setTheatres={setTheatres}/>
                )
            }
            </div>
            
        </div>
    )
}

export default ControlsT