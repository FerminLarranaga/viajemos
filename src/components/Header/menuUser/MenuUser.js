import React, { useState } from 'react';
import { useAuth } from '../../../App';
import LogOut from '../../Dialogs/LogOut/LogOut';

import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ListItemText, ListItemIcon } from '@material-ui/core';
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from '@material-ui/icons/Person';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function MenuUser() {
  const [anchorEl, setAnchorEl] = useState(null); // Menu abierto o cerrado
  const [logOutModalOpen, setLogOutModalOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  // Abrir menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cerrar menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    // Margen entre el AddPostIcon y el Menu
    <div>
      {/* FOTO DE PERFIL */}
      <Avatar
        src={auth.user.profile_pic}
        fontSize="small"
        className="pointer"
        style={{width: 24, height: 24}}
        onClick={handleClick}
      />
      {/* MENU */}
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
      <div>
        <StyledMenuItem onClick={() => {navigate(`/${auth.user.username}`); handleClose()}}>
          <ListItemIcon>
            <PersonIcon size='small'/>
          </ListItemIcon>
          <ListItemText>Perfil</ListItemText>
        </StyledMenuItem>
        <div style={{borderTop: '1px solid lightgray'}}>
          <StyledMenuItem onClick={() => { setLogOutModalOpen(true); handleClose();}}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cerrar sesión</ListItemText>
          </StyledMenuItem>
        </div>
      </div>
      </StyledMenu>
      {
        logOutModalOpen && (
          <LogOut closeDialog={() => setLogOutModalOpen(false)}/>
        )
      }
    </div>
  );
}
