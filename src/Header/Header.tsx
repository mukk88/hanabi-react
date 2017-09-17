import * as React from 'react';
import { Auth } from '../Login/Auth';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { red500, green500 } from 'material-ui/styles/colors';

interface ILoginPage {
  auth: Auth;
  connected: boolean;
}

const iconStyles = {
  marginRight: 24,
};

export const Header = (props: ILoginPage) => {
  const rightIcon = props.auth.isAuthenticated() ?
    <FlatButton label="Logout" onTouchTap={() => props.auth.logout()}/> :
    undefined;

  const connectedIcon = props.connected ? 
    <FontIcon className="material-icons" style={iconStyles} color={green500}>videogame_asset</FontIcon> : 
    <FontIcon className="material-icons" style={iconStyles} color={red500}>videogame_asset</FontIcon>;

  const profile = props.auth.getProfile();

  return (
    <div>
      <AppBar
        title={<span>{profile}</span>}
        onTitleTouchTap={() => {window.location.assign('/'); }}
        iconElementLeft={connectedIcon}
        iconElementRight={rightIcon}
      />
    </div>
  );
};