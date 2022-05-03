import React, { useEffect, useRef, useState } from 'react';

import { Avatar } from "@material-ui/core";
import 'react-widgets/dist/css/react-widgets.css';

import './UserSearchBox.css';
import { Link } from 'react-router-dom';

export default function UserSearchBox() {
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef();
  const dropdownExitRef = useRef();
  const dropdownSquareRef = useRef();

  const getUsers = async () => {
    const res = await fetch('/getUsers', {
      method: 'GET',
      headers: { token: localStorage.token }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData?.message ? errorData.message : errorData);
      return
    }

    setOptions(await res.json());
  }

  const handleQuery = (evt) => {
    setQuery(evt.target.value);
  }

  const handleDropdown = (display) => {
    dropdownRef.current.style.display = display;
    dropdownSquareRef.current.style.display = display === 'block'? 'flex' : 'none';
    dropdownExitRef.current.style.display = display;
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className='userSearchBox_container'>
      <div className='userSearchBox_inputContainer'>
        <input
          type='text'
          onChange={handleQuery}
          className='userSearchBox_input'
          placeholder='Buscar'
          onMouseDown={() => handleDropdown('block')}
        />
        <div
          className='userSearchBox_dropdownExit'
          style={{ display: 'none' }}
          ref={dropdownExitRef}
          onMouseDown={() => handleDropdown('none')}
        />
        {/* <svg ariaLabel="Buscar" class="_8-yf5 " color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16">
          <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          </path>
          <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22">
          </line>
        </svg> */}
      </div>
      <div ref={dropdownSquareRef} className='userSearchBox_dropdownSquareContainer'>
          <div className='userSearchBox_dropdownSquare' />
      </div>
      <div className='userSearchBox_dropdown' style={{ display: 'none' }} ref={dropdownRef}>
        <div className='userSearchBox_dropdownProfiles'>
          <h4 className='userSearchBox_dropdownProfilesTitle'>Sugerencias</h4>
          {
            options.map(item => (
              <Link
                key={item.username}
                to={`/${item.username}`}
                className='userSearchBox_dropdownProfile'
                onClick={() => handleDropdown('none')}
              >
                <div className='suggests_userInfo' style={{justifyContent: 'space-between'}}>
                  <Avatar
                    className='suggests_userInfoAvatar'
                    src={item.profile_pic}
                    style={{width: 40, height: 40}}
                  />
                  <div className='suggests_userInfoTxt'>
                    <span className='suggests_userUsername'>{item.username}</span>
                    <span className='suggests_userFullName'>{item.full_name}{item.isFollowing && ' • Seguido'}</span>
                  </div>
                </div>
                {/* <button onClick={() => { }} className="feedPosts_usersProfileChangeBtn">Seguir</button> */}
                {/* <svg ariaLabel="Cerrar" class="_8-yf5 " color="#8e8e8e" fill="#8e8e8e" height="16" role="img" viewBox="0 0 24 24" width="16">
                  <polyline fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                  </polyline>
                  <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354">
                  </line>
                </svg> */}
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
}