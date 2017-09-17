import * as React from 'react';
import * as _ from 'lodash';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import FontIcon from 'material-ui/FontIcon';
import { GameActions } from './Card';
import tokenGenerator from '../TokenGenerator';

interface IFooterProps {
  canPlay: boolean;
  currentPlayer: string;
  validActions: GameActions[];
  sendActionFunction: Function;
  override?: string;
}

const bottomNavStyle: React.CSSProperties = {
  position: 'fixed',
  right: '0',
  bottom: '0',
  left: '0',
  zIndex: 99,
  textAlign: 'center',
  backgroundColor: 'white',
};

const navItemStyle: React.CSSProperties = {
  marginLeft: '1em'
};

export const Footer = (props: IFooterProps) => {

  if (props.override) {
    return (
      <div style={bottomNavStyle}>
        <div style={{height: '1em'}} />
        <div>{props.override}</div>
        <div style={{height: '1em'}} />
      </div>
    );
  }

  const typeMap = {
    discard: {
      icon: 'delete',
      label: 'discard',
      action: GameActions.DISCARD,
      onClick: () => {
        props.sendActionFunction(GameActions.DISCARD);
      },
    }, 
    clueNum: {
      icon: 'looks_one',
      label: 'clue number',
      action: GameActions.CLUE_NUM,
      onClick: () => {
        props.sendActionFunction(GameActions.CLUE_NUM);
      },
    }, 
    clueSuit: {
      icon: 'favorite',
      label: 'clue suit',
      action: GameActions.CLUE_SUIT,
      onClick: () => {
        props.sendActionFunction(GameActions.CLUE_SUIT);
      },
    }, 
    play: {
      icon: 'play_arrow',
      label: 'play',
      action: GameActions.PLAY,
      onClick: () => {
        props.sendActionFunction(GameActions.PLAY);
      },
    }
  };

  const navItems = _.map(props.validActions, action => {

    const matchingType = _.find(typeMap, type => type.action === action);
    if (matchingType === undefined) {
      return <div />;
    }

    return (
      <BottomNavigationItem
        key={tokenGenerator()}
        style={navItemStyle}
        onTouchTap={matchingType.onClick}
        icon={<FontIcon className="material-icons">{matchingType.icon}</FontIcon>}
        label={matchingType.label}
      />
    );
  });

  const content = props.canPlay ? props.validActions.length !== 0 ?
    (
      <BottomNavigation>
        {navItems}
      </BottomNavigation>
    ) : (
      <div>
        <div style={{height: '1em'}} />
        <div> Your turn </div>
        <div>No valid actions</div>
        <div style={{height: '1em'}} />
      </div>
    ) : (
      <div>
        <div style={{height: '1em'}} />
        <div>Waiting for {props.currentPlayer}.. </div>
        <div style={{height: '1em'}} />
      </div>
    );

  return (
    <div style={bottomNavStyle}>
      {content}
    </div>
  );
};