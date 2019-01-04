.import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countItems' })
export class CountItemsPipe implements PipeTransform {
  transform(cards: any[], countItems, type): number {
    // console.log(cards);
    
    if (!cards || cards.length === 0) return 0;
    if (typeof(countItems) == 'string') {
      return cards.reduce((count, card) => card[type].indexOf(countItems) !== -1 ? count + 1 : count, 0);
    }else{
      if (countItems != undefined) {
      var gt = countItems.from
      var lt = countItems.to
      if (gt && !lt) {
        return cards.reduce((count, card) => card[type] > gt && card[type] !== null ? count + 1 : count, 0);
      }else if(!gt && lt){
        return cards.reduce((count, card) => card[type] < lt && card[type] !== null ? count + 1 : count, 0);
      }else{
        return cards.reduce((count, card) => card[type] >=gt && card[type] < lt  ? count + 1 : count, 0);
      }
    }

    }
  }
}