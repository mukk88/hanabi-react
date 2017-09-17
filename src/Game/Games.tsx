import * as React from 'react';
import * as _ from 'lodash';
import { emit, subscribe } from '../Socket';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {
  IGame,
} from './Game';
import {
  Loading,
  LoadingStates,
  LoadingError,
  IStatus,
} from '../Loading/Loading';

interface IGamesState {
  allGames: IGame[];
  loadState: LoadingStates;
  newGamePlayers: number;
  errorHint: string;
  gameName: string;
}

interface ICreateGameStatus extends IStatus {
  Token: string; 
}

const marginLeftStyle: React.CSSProperties = {
  marginLeft: '2em',
};

const dropdownStyle: React.CSSProperties = {
  float: 'right',
  marginTop: '-0.55em',
  marginRight: '2em',
};

export class Games extends React.Component<{}, IGamesState> {

  constructor() {
    super();
    this.state = {
      allGames: [],
      loadState: LoadingStates.LOADING,
      newGamePlayers: 4,
      errorHint: '',
      gameName: '',
    };
    subscribe('game created', (allGames: IGame[]) => this.setState({ 
      allGames,
      loadState: LoadingStates.LOAD_SUCCESS,
    }));
    emit('all games', {}, (status: IStatus) => {
      if (status.Status !== 'success') {
        this.setState({
          loadState: LoadingStates.LOAD_FAILED
        });
      }
    });
  }

  onCellClicked = (row: number, column: number) => {
    const gameId = this.state.allGames[row].Token;
    const redirectString = `/game/${gameId}`;
    window.location.assign(redirectString);
  }

  // tslint:disable-next-line
  handleDropdownChange = (event: any, index: number, newGamePlayers: number) => {
    this.setState({ newGamePlayers });
  }

  handleCreateGame = () => {
    if (this.state.gameName === '') {
      this.setState({
        errorHint: 'Name cannot be empty'
      });
      return;
    }
    const data = {
      Name: this.state.gameName,
      AllowedPlayers: this.state.newGamePlayers,
    };
    emit('create game', data, (status: ICreateGameStatus) => {
      if (status.Status !== 'success') {
        alert('failed to create game, please try again');
      } else {
        window.location.assign(`/game/${status.Token}`);
      }
    });
  }

  // tslint:disable-next-line
  handleGameNameChange = (event: any) => {
    this.setState({
      errorHint: '',
      gameName: event.target.value,
    });
  }

  render() {

    if (this.state.loadState === LoadingStates.LOADING) {
      return (
        <Loading />
      );
    } else if (this.state.loadState === LoadingStates.LOAD_FAILED) {
      return (
        <LoadingError msg={'Load failed, please try again.'}/>
      );
    }

    const gameRows = _.map(this.state.allGames, gameMetadata => {
      return (
        <TableRow key={gameMetadata.Token}>
          <TableRowColumn>
            {gameMetadata.MetaData.Name}
          </TableRowColumn>
          <TableRowColumn>
            {`${gameMetadata.MetaData.PlayerNames.length}/${gameMetadata.MetaData.AllowedPlayers}`}
          </TableRowColumn>
        </TableRow>);
    });

    return (
      <div>
        <Subheader>Create game</Subheader>
        <div>
          <TextField
            style={marginLeftStyle}
            hintText={'Game name'}
            value={this.state.gameName}
            errorText={this.state.errorHint}
            onChange={this.handleGameNameChange}
          />
          <DropDownMenu 
            style={dropdownStyle}
            value={this.state.newGamePlayers}
            onChange={this.handleDropdownChange}
          >
            <MenuItem value={2} primaryText="2" />
            <MenuItem value={3} primaryText="3" />
            <MenuItem value={4} primaryText="4" />
            <MenuItem value={5} primaryText="5" />
          </DropDownMenu>
        </div>
        <RaisedButton
          style={{float: 'right', marginRight: '1em', marginTop: '1em'}}
          label={'Create game'}
          onTouchTap={this.handleCreateGame}
        />
        <div style={{height: '4em'}}/>
        <Subheader>All games</Subheader>
        <Table
          onCellClick={this.onCellClicked}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Players</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {gameRows}
          </TableBody>
        </Table>
      </div>
    );
  }
}