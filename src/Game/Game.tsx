import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import Subheader from 'material-ui/Subheader';
import { subscribe, emit } from '../Socket';
import { CardHolder } from './CardHolder';
import { Footer } from './Footer';
import { GameActions } from './Card';
import { Info } from './Info';
import {
  Loading,
  LoadingStates,
  LoadingError,
  IStatus,
} from '../Loading/Loading';
import tokenGenerator from '../TokenGenerator';
import {
  ICardData,
  IPlayerData,
} from './Interfaces';
import {
  gameGetValidActions,
  getSelectedCards,
  getSelectedHand,
  gameSendAction
} from './GameLogic';

interface IGameMetadata {
  Name: string;
  AllowedPlayers: number;
  PlayerNames: string[];
}

interface IGameData {
  Players: IPlayerData[];
  Turn: number;
  Deck: ICardData[];
  Clues: number;
  Burns: number;
  Table: number[];
  Discards: ICardData[];
  Status: number;
  LastMove: string;
  LastTurnCount: number;
}

export interface IGame {
  MetaData: IGameMetadata;
  Token: string;
  Data: IGameData;
} 

interface IGameState {
  gameData: IGameData;
  loadState: LoadingStates;
  chosenAction: number;
  playerName: string | null;
  selectedCards: Boolean[][];
  maxPlayers: number;
  showHistory: boolean;
}

class Game extends React.Component<RouteComponentProps<{ id: string }>, IGameState> {

  constructor(props: RouteComponentProps<{ id: string }>) {
    super(props);
    this.state = {
      gameData: {
        Players: [],
        Turn: 0,
        Deck: [],
        Clues: 0,
        Burns: 0,
        Table: [0, 0, 0, 0, 0],
        Discards: [],
        Status: 0,
        LastMove: '',
        LastTurnCount: 0,
      },
      loadState: LoadingStates.LOADING,
      chosenAction: -1,
      playerName: localStorage.getItem('profile'),
      selectedCards: [],
      maxPlayers: 0,
      showHistory: false,
    };

    const profile = localStorage.getItem('profile');

    if (profile !== null) {

      const joinGameData = {
        Token: this.props.match.params.id,
        PlayerName: localStorage.getItem('profile'), 
      };
      emit('join game', joinGameData, (status: IStatus) => {
        if (status.Status !== 'success') {
          this.setState({
            loadState: LoadingStates.LOAD_FAILED
          });
        }
      });
    } else {
      this.setState({
        loadState: LoadingStates.LOAD_FAILED,
      });
    }
    subscribe('game changed', (game: IGame) => {
      this.setState({ 
        maxPlayers: game.MetaData.AllowedPlayers,
        gameData: game.Data,
        loadState: LoadingStates.LOAD_SUCCESS,
        showHistory: true,
      });
    });

  }

  updateChosenAction = (chosenAction: number) => {
    this.setState({
      chosenAction
    });
  }

  onCardClicked = (playerIndex: number, cardIndex: number) => {

    const newSelectedCards = this.state.selectedCards;
    if (!newSelectedCards[playerIndex]) {
      newSelectedCards[playerIndex] = [];
    }
    newSelectedCards[playerIndex][cardIndex] = !newSelectedCards[playerIndex][cardIndex];

    this.setState({
      selectedCards: newSelectedCards,
      showHistory: false,
    });
  }

  getValidActions = () => {
    return gameGetValidActions(
      this.state.selectedCards,
      this.state.gameData.Players,
      this.state.playerName
    );
  }

  selectedHand = () => {
    return getSelectedHand(this.state.selectedCards);
  }

  selectedCards = () => {
    return getSelectedCards(this.selectedHand(), this.state.selectedCards);
  }

  updateSelectedCards = () => {
    const selectedCards = _.map(this.state.gameData.Players, player => {
      return _.map(player.Cards, card => false);
    });
    this.setState({
      selectedCards,
    });
  }

  sendAction = (action: GameActions) => {
    gameSendAction(
      this.props.match.params.id,
      action,
      this.state.gameData.Turn,
      this.selectedHand(),
      this.selectedCards(),
      this.updateSelectedCards,
      this.state.gameData.Clues,
    );
  }
  
  setHistory = () => {
    this.setState({
      showHistory: true,
    });
  }

  render() {

    if (this.state.loadState === LoadingStates.LOADING) {
      return (
        <Loading />
      );
    } else if (this.state.loadState === LoadingStates.LOAD_FAILED) {
      return (
        <LoadingError msg={'Game full, unable to join.'}/>
      );
    } else if (this.state.gameData.Players.length !== this.state.maxPlayers) {
      return (
        <LoadingError 
          msg={`Waiting for all players to join ${this.state.gameData.Players.length}/${this.state.maxPlayers}`}
        />
      );
    }
    
    const table = _.map(this.state.gameData.Table, (value, index) => ({
      selectable: false,
      value,
      suit: index,
      hidden: false,
      selected: false,
    }));

    const gameOver = this.state.gameData.Status === 3 || this.state.gameData.Status === 4;

    const isCurrentTurn = this.state.playerName === this.state.gameData.Players[this.state.gameData.Turn].Name;
    const isSelectable = isCurrentTurn && !gameOver;

    const gameOverResult = gameOver ? this.state.gameData.Status === 3 ? 'You won!' : 'You lost' : undefined;

    const players = _.map(this.state.gameData.Players, (player, index) => {
      const cards = _.map(player.Cards, (card, cardIndex) => ({
        selectable: isSelectable,
        value: card.Number,
        suit: card.Suit,
        suitRevealed: card.SuitRevealed,
        valueRevealed: card.NumberRevealed,
        hidden: player.Name === this.state.playerName,
        selected: this.state.selectedCards[index] && this.state.selectedCards[index][cardIndex],
        onClick: this.onCardClicked,
        playerIndex: index,
        handIndex: cardIndex,
      }));
      return (
        <div key={tokenGenerator()}>
          <Subheader>{player.Name}</Subheader>
          <CardHolder
            cards={cards}
          />
        </div>
      );
    });

    const discards = _.map(this.state.gameData.Discards, card => ({
      selectable: false,
      value: card.Number,
      suit: card.Suit,
      hidden: false,
      selected: false,
    }));

    const validActions = this.getValidActions();

    return (
      <div>
        <Info
          deckLength={this.state.gameData.Deck.length}
          clues={this.state.gameData.Clues}
          burns={this.state.gameData.Burns}
          showHistory={this.state.showHistory}
          lastMove={this.state.gameData.LastMove}
          setHistory={this.setHistory}
          token={this.props.match.params.id}
        />
        <Subheader>Table</Subheader>
        <CardHolder
          cards={table}
        />
        {players}
        <Subheader>Discards</Subheader>
        <CardHolder
          cards={discards}
        />
        <div style={{height: '7em'}} />
        <Footer
          canPlay={isSelectable}
          currentPlayer={this.state.gameData.Players[this.state.gameData.Turn].Name}
          validActions={validActions}
          sendActionFunction={this.sendAction}
          override={gameOverResult}
        />
      </div>
    );
  }
}

export default withRouter(Game);