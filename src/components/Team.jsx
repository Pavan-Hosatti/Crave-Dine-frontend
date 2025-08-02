import React from 'react'
import {data} from '../../restApi.json';
import '../pages/Dashboard.css';

const Team = () =>{
    return (
        <section className='team' id='team'>
     <div className="container">
        <div className="heading_section">
            <h1 className='heading'>OUR TEAM</h1>
            <p>Our passionate, dedicated team works together to deliver exceptional service and unforgettable meals, ensuring every guest feels valued.</p>
        </div>
        <div className="team_conatiner">
            {
                data[0].team.map(element=>{
                    return(
                        <div className="card" key={element.id}>
                            <img src={element.image} alt={element.name}  />
                            <h3>{element.name}</h3>
                            <p>{element.designation}</p>
                        </div>
                    )
                }) 
            }
        </div>
     </div>
        </section>
    )
}

export default Team;