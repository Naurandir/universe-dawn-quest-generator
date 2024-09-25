import { Pipe, PipeTransform } from '@angular/core';
import { IQuestStep, IQuestSteps } from './quest-ud.model';

@Pipe({
  name: 'questStepsArray',
  standalone: true,
  pure: false
})
export class QuestStepsArrayPipe implements PipeTransform {

  transform(questSteps: IQuestSteps): IQuestStep[] {
    if (questSteps == null) {
      return [];
    }
    return Object.values(questSteps).sort((s1, s2) => Number(s1.id) - Number(s2.id));
  }

}
