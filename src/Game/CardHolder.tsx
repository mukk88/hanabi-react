import * as React from 'react';
import * as _ from 'lodash';
import { Card, ICardProps } from './Card';
import { GridList, GridTile } from 'material-ui/GridList';
import tokenGenerator from '../TokenGenerator';

interface ICardHolderProps {
  cards: ICardProps[];
}

const gridListRoot: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
};

const gridListStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
};

const gridTileStyle: React.CSSProperties = {
  marginLeft: '0.5em',
};

export const CardHolder = (props: ICardHolderProps) => {

  const cards = _.map(props.cards, (card) => {
    return (
      <GridTile  key={tokenGenerator()} style={gridTileStyle}>
        <Card
          selectable={card.selectable}
          value={card.value}
          suit={card.suit}
          suitRevealed={card.suitRevealed}
          valueRevealed={card.valueRevealed}
          selected={card.selected}
          hidden={card.hidden}
          onClick={card.onClick}
          playerIndex={card.playerIndex}
          handIndex={card.handIndex}
        />
      </GridTile>
    );
  });

  return (
    <div style={gridListRoot}>
      <GridList cols={1} cellHeight="auto" style={gridListStyle}>
        {cards}
      </GridList> 
    </div>
  );
};