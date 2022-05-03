import React from 'react';
import { useAuth } from '../../App';
import './Home.css';

const Home = () => {
    const user = useAuth().user;
    console.log(user);
    return (
        <div>
            <header>
                
            </header>
            <h1>
                {`Hola ${user.name} ${user.surname}`}
            </h1>
        </div>
    )
}

export default Home;