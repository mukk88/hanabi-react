import * as React from 'react';
import { emit } from '../Socket';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';
import { grey500 } from 'material-ui/styles/colors';
import {
  IStatus
} from '../Loading/Loading';

interface IInfoProps {
  deckLength: number;
  clues: number;
  burns: number;
  showHistory: boolean;
  lastMove: string;
  setHistory: Function;
  token: string;
}

const chipStyle: React.CSSProperties = {
  marginLeft: '2%',
};
const chipWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  textAlign: 'center',
};

const historyIconStyle: React.CSSProperties = {
  marginTop: '0.15em',
  marginLeft: '0.2em',
};

export const Info = (props: IInfoProps) => {
  
  const refreshData = () => {

    const refreshGameData = {
      Token: props.token,
    };

    emit('refresh game', refreshGameData, (status: IStatus) => {
      if (status.Status !== 'success') {
        alert('could not contact refresh game!');
      }
    });
  };

  return (
    <div>
      <div style={{height: '1em'}} />
      <div style={chipWrapperStyle}>
        <FontIcon 
          onClick={refreshData}
          className="material-icons"
          style={historyIconStyle}
          color={grey500}
        >
          autorenew
        </FontIcon>
        <Chip style={chipStyle}>
          Cards: {props.deckLength}
        </Chip>
        <Chip style={chipStyle}>
          Clues: {props.clues}
        </Chip>
        <Chip style={chipStyle}>
          Burns: {props.burns}
        </Chip>
        <FontIcon 
          onClick={() => {props.setHistory(); }}
          className="material-icons"
          style={historyIconStyle}
          color={grey500}
        >
          history
        </FontIcon>
      </div>
      <Snackbar
        open={props.showHistory}
        message={`${props.lastMove}`}
        autoHideDuration={2000}
      />
    </div>
  );
};