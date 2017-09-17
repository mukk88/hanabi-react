import * as React from 'react';

declare function require(path: string): string;

export interface ICardProps {
  selectable: Boolean;
  value: number;
  suit: number;
  hidden: Boolean;
  selected: Boolean;
  onClick?: Function;
  suitRevealed?: Boolean;
  valueRevealed?: Boolean;
  currentAction?: number;
  playerIndex?: number;
  handIndex?: number;
}

export enum GameActions {
  DISCARD,
  CLUE_NUM,
  CLUE_SUIT,
  PLAY,
}

const suitMapping = {
  0: 'club',
  1: 'diamond',
  2: 'heart',
  3: 'joker',
  4: 'spade',
};

const cardStyle: React.CSSProperties = {
  textAlign: 'center',
  width: '48px',
  border: '1px solid black',
  height: '60px',
};

const imageStyle: React.CSSProperties = {
  display: 'inline',
  width: '60%',
  marginTop: '13px',
};

const numberStyle: React.CSSProperties = {
  float: 'left',
  margin: '21px -7px 0px 10px',
  fontSize: '1em'
};

export const Card = (props: ICardProps) => {

  const valueColor = props.selected ? {color: 'white'} : props.valueRevealed ? {color: 'blue'} : {};
  const suitColor = props.selected ? 'light' : props.suitRevealed ? 'blue' : 'dark';
  const value  = !props.hidden || props.valueRevealed ? props.value : '';
  const suit  = !props.hidden || props.suitRevealed ? (
    <img 
      style={imageStyle}
      src={require(`../img/${suitColor}/${suitMapping[props.suit]}.png`)} 
    />
  ) : <div />;

  const onClick = () => {
    if (props.onClick) {
      props.onClick(props.playerIndex, props.handIndex);
    }
  };

  const selectedBackgroundStyle: React.CSSProperties = props.selected ? {
    backgroundColor: 'black',
  } : {};

  return (
    <div onClick={onClick}>
      <div style={{...cardStyle, ...valueColor, ...selectedBackgroundStyle}}>
        <div style={numberStyle}>
          {value}
        </div>
      {suit}
      </div>
    </div>
  );
};
