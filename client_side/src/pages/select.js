import React, { useEffect, useState } from 'react';
import TopNav from '../components/topNavBarManager'
import SideNav from '../components/sideNavBarManger'
import '../styles/select.css'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
});

function Home() {

    const [players, setPlayers] = useState();

    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPlayers();
    }, []);

    const getPlayers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/getplayer`);
            setPlayers(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const selectplayer= async (e) =>{
        try {
            const response = await axios.post(`http://localhost:5000/addauctionplayer/${id}`, e);
            if (response.data === "exist") {
                alert("Already in Bid");
            } else if(response.data === "soldorunsold"){
                alert("Player Either Sold or Unsold")
            }
            else {     
                navigate(`/manager/${id}`)
                socket.emit('AddAuction', id); 
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className='top-position'><TopNav Title={"Select"}/></div>
            <div className='d-flex'>
                <div className='side-position'><SideNav /></div>
                <div className='main'>
                    <div className='task-search-filter mt-4'>
                    </div>
                    <div className='task-search-filter mt-3'>
                        <button className='task-btn' style={{ marginLeft: '0px' }}>Batsman</button>
                        <button className=' task-btn'>Bowler</button>
                        <button className=' task-btn' style={{ width: '70px' }}>All</button>
                        <button className=' task-btn' style={{ width: '70px' }}>All</button>
                    </div>
                    <div className='task-list mt-4'>
                        <div className='tasks-body'>
                            <div className=' task_title pb-3 pt-4' style={{ fontSize: '20px', color: '#0051ad', fontWeight: '500' }}>Players List</div>
                            <div className='task_body'>
                                <div className='task_body_title mt-5 pb-3'>
                                    <div className='title-h1'>Name</div>
                                    <div className='title-h2'>Country</div>
                                    <div className='title-h3'>Category</div>
                                    <div className='title-h4'>Base Price</div>
                                    <div className='title-h5'>Points</div>
                                </div>
                                {players ? players.map(player => (
                                    <>
                                        <div className='task-inside-body pb-1' onClick={() => { selectplayer(player) }}>
                                            <div className='title-c1'>{player.name}</div>
                                            <div className='title-c2'>{player.countryshort}</div>
                                            <div className='title-c3'>{player.category}</div>
                                            <div className='title-c4'>{player.baseprice}</div>
                                            <div className='title-c5'>{player.points}</div>
                                        </div>
                                        <div className='task-inside-body-mobile pb-1' onClick={() => { selectplayer(player) }}>
                                            <div className='mobile-c1' style={{ fontSize: '13px' }}>{player.name}</div><div className='mobile-c1'>|</div>
                                            <div className='mobile-c1'>{player.countryshort}</div><div className='mobile-c1'>|</div>
                                            <div className='mobile-c1'>{player.category}</div><div className='mobile-c1'>|</div>
                                            <div className='mobile-c1'>{player.baseprice}</div><div className='mobile-c1'>|</div>
                                            <div className='mobile-c1'>{player.points}</div>
                                        </div>
                                    </>
                                )) : <div>Loading..</div>}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>

    )
}

export default Home;