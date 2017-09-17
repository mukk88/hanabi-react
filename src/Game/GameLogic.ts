import * as _ from 'lodash';
import { IPlayerData, ICardData } from './Interfaces';
import { GameActions } from './Card';
import { emit } from '../Socket';
import {
  IStatus,
} from '../Loading/Loading';

const canClue = (isSuit: boolean, cards: ICardData[], selectedCards: Boolean[]) => {
  let firstSelected = -1;
  _.some(selectedCards, (card, index) => {
    if (card) {
      firstSelected = isSuit ? cards[index].Suit : cards[index].Number; 
      return true;
    }
    return false;
  });
  if (firstSelected === -1) {
    return false;
  }
  return _.every(selectedCards, (card, index) => {
    const compared = isSuit ? cards[index].Suit : cards[index].Number;
    if (card && compared !== firstSelected) {
      return false;
    }
    if (!card && compared === firstSelected) {
      return false;
    }
    return true;
  });
};

export const gameGetValidActions = (selectedCards: Boolean[][], players: IPlayerData[], playerName: string | null) => {
  const handsSelected = _.map(selectedCards, (selectedHand, index)  => {
    return _.reduce(selectedHand, (selected, card) => {
      return selected || card;
    // tslint:disable-next-line
    }, false);
  });
  const selectedIndexes: number[] = [];
  _.each(handsSelected, (hand, index) => {
    if (hand) {
      selectedIndexes.push(index);
    }
  });
  if (selectedIndexes.length !== 1) {
    return [];
  }
  const playerNames = _.map(players, player => player.Name);
  const selfIndex = _.indexOf(playerNames, playerName);
  const selectedIndex = selectedIndexes[0];
  if (selectedIndexes[0] === selfIndex) {
    if (_.countBy(selectedCards[selectedIndex], value => value === true).true === 1) {
      return [GameActions.DISCARD, GameActions.PLAY];
    } else {
      return [];
    }
  } else {
    const curSelectedCards: ICardData[] = [];
    _.each(selectedCards[selectedIndex], (selected, index) => {
      if (selected) {
        curSelectedCards.push(players[selectedIndex].Cards[index]);
      }
    });
    const result: GameActions[] = [];
    if (canClue(false, players[selectedIndex].Cards, selectedCards[selectedIndex])) {
      result.push(GameActions.CLUE_NUM);
    }
    if (canClue(true, players[selectedIndex].Cards, selectedCards[selectedIndex])) {
      result.push(GameActions.CLUE_SUIT);
    }
    return result;
  }
};

export const getSelectedHand = (selectedCards: Boolean[][]) => {
  let selectedHand = -1;
  _.each(selectedCards, (hand, index) => {
    _.each(hand, card => {
      if (card) {
        selectedHand = index;
      }
    });
  });
  return selectedHand;
};

export const getSelectedCards = (hand: number, gameSelectedCards: Boolean[][]) => {
  const selectedCards: number[] = [];
  _.each(gameSelectedCards[hand], (card, index) => {
    if (card) {
      selectedCards.push(index);
    }
  });
  return selectedCards;
};

export const gameSendAction = (
  token: string, 
  action: GameActions, 
  fromPlayerIndex: number, 
  hand: number, 
  cards: number[],
  callback: Function,
  cluesLeft: number,
) => {
  const sharedData = {
    token: token,
    FromPlayerIndex: fromPlayerIndex,
  };
  let data = {};
  let actionString = '';
  switch (action) {
    case GameActions.CLUE_NUM: {
      if (cluesLeft <= 0) {
        alert('no clues left!');
        return;
      }
      data = {
        toPlayerIndex: hand,
        cardIndexes: cards,
        isNum: true,
      };
      actionString = 'action clue';
      break;
    }
    case GameActions.CLUE_SUIT: {
      if (cluesLeft <= 0) {
        alert('no clues left!');
        return;
      }
      actionString = 'action clue';
      data = {
        toPlayerIndex: hand,
        cardIndexes: cards,
        isNum: false,
      };
      break;
    }
    case GameActions.DISCARD: {
      actionString = 'action discard';
      data = { cardIndex: cards[0] };
      break;
    }
    case GameActions.PLAY: {
      actionString = 'action play';
      data = { cardIndex: cards[0] };
      break;
    }
    default: {
      return;
    }
  }
  emit(actionString, {...data, ...sharedData}, (status: IStatus) => {
    if (status.Status !== 'success') {
      alert('failed to execute action, please try again');
    } else {
      callback();
    }
  });
};