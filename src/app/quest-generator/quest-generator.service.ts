import { Injectable } from '@angular/core';
import { EComponentType, ELocalisation, EReturnReward, ETaskType, ICoordinates, IQuest, IQuestPrepareNpcs, IQuestStep, IQuestSteps, IQuestTaskDialogue, IQuestTaskTransactCredits, IReturnRewardGiveLicense, IReturnRewardGiveResources, TQuestCondition, TQuestTask, TResources, TReturnReward } from './quest-ud.model';

@Injectable({
  providedIn: 'root'
})
export class QuestGeneratorService {

  constructor() { }

  public createNewQuest(): IQuest {
    let newQuest: IQuest = {
      _id: 'quest-' + (1000000 + Math.floor(Math.random() * 1000000)),
      conditions: [],
      name: {
        [ELocalisation.de]: 'New Quest',
        [ELocalisation.en]: 'New Quest'
      },
      createdAt: new Date(),
      notification: {
        de: {
          customText: '',
          variables: {}
        },
        en: {
          customText: '',
          variables: {}
        }
      },
      prepareNpcs: [],
      startStepId: '00',
      steps: {}
    };

    return newQuest;
  }

  createStep(stepId: string, stepType: 'transactCredits' | 'dialogue', stepNotificationDe: string, stepNotificationEn: string | null,
    transactCreditsAmount: number | null, transactCreditsRuler: string | null,
    coordinates: string | null, dialogCorrectWordDe: string | null, dialogCorrectWordEn: string | null): IQuestStep {
      let questStep: IQuestStep = {
        id: stepId,
        nextPossibleSteps: [],
        notification: {
          de: {
            customText: stepNotificationDe,
            variables: {}
          }
        },
        task: this.createQuestTask(stepType, transactCreditsAmount, transactCreditsRuler, coordinates, dialogCorrectWordDe, dialogCorrectWordEn),
        rewards: []
      };

      if (stepNotificationEn != null) {
        questStep.notification.en = {
          customText: stepNotificationEn,
          variables: {}
        };
      }

      return questStep;
  }

  addStep(step: IQuestStep, quest: IQuest) {
    quest.steps[step.id] = step;
    this.updateStepIds(quest);
  }

  moveStepUp(step: IQuestStep, quest: IQuest) {
    if (Number(step.id) == 0) {
      return; // nothing to do already on top
    }

    let newPosition: number = Number(step.id) - 1;
    let stepsList: IQuestStep[] = Object.values(quest.steps);

    for (let currentStep of stepsList) {
      if (Number(currentStep.id) == newPosition) {
        // delete keys in steps
        delete quest.steps[currentStep.id];
        delete quest.steps[step.id];

        // update new step
        currentStep.id = this.getNormalizedStepId(Number(currentStep.id) + 1);
        step.id = this.getNormalizedStepId(newPosition);

        // add keys in steps
        quest.steps[currentStep.id] = currentStep;
        quest.steps[step.id] = step;

        break;
      }
    }

    this.updateStepIds(quest);
  }

  moveStepDown(step: IQuestStep, quest: IQuest) {
    let stepsList: IQuestStep[] = Object.values(quest.steps);

    if (Number(step.id) == stepsList.length - 1) {
      return; // nothing to do already on bottom
    }

    let newPosition: number = Number(step.id) + 1;

    for (let currentStep of stepsList) {
      if (Number(currentStep.id) == newPosition) {
        // delete keys in steps
        delete quest.steps[currentStep.id];
        delete quest.steps[step.id];

        // update new step
        currentStep.id = this.getNormalizedStepId(Number(currentStep.id) - 1);
        step.id = this.getNormalizedStepId(newPosition);

        // add keys in steps
        quest.steps[currentStep.id] = currentStep;
        quest.steps[step.id] = step;

        break;
      }
    }

    this.updateStepIds(quest);
  }

  deleteStep(step: IQuestStep, quest: IQuest) {
    delete quest.steps[step.id];

    this.updateStepIds(quest);
  }

  /**
   * Recreate order (like if move or delete was done)
   */
  private updateStepIds(quest: IQuest) {
    let stepsList: IQuestStep[] = Object.values(quest.steps);

    stepsList.sort((s1, s2) => Number(s1.id) - Number(s2.id));
    stepsList.forEach((s, i) => s.id = this.getNormalizedStepId(i));

    quest.steps = {};

    stepsList.forEach(s => quest.steps[s.id] = s);

    // update dependencies
    let reverseList: IQuestStep[] = stepsList.slice().reverse();
    let nextStep: IQuestStep | null = null;

    for (let currentStep of reverseList) {
      if (nextStep == null) {
        currentStep.nextPossibleSteps = [ ];
      } else if (nextStep != null) {
        currentStep.nextPossibleSteps = [ nextStep.id ];
      }

      nextStep = currentStep;
    }
  }

  getNormalizedStepId(stepId: number | string): string {
    return Number(stepId) < 10 ? "0" + Number(stepId): "" + Number(stepId);
  }

  createQuestTask(stepType: 'transactCredits' | 'dialogue',
    transactCreditsAmount: number | null, transactCreditsRuler: string | null,
    coordinates: string | null, dialogCorrectWordDe: string | null, dialogCorrectWordEn: string | null): TQuestTask {
      if (stepType == 'transactCredits') {
        return this.createQuestTaskTransactCredits(transactCreditsAmount!, transactCreditsRuler!);
      } else {
        return this.createQuestTaskDialog(coordinates!, dialogCorrectWordDe!, dialogCorrectWordEn!);
      }
  }

  createQuestTaskTransactCredits(transactCreditsAmount: number, transactCreditsRuler: string): IQuestTaskTransactCredits {
    let questTask: IQuestTaskTransactCredits = {
      amount: transactCreditsAmount,
      rulerName: transactCreditsRuler,
      type: ETaskType.transactCredits
    };

    return questTask;
  }

  createQuestTaskDialog(coordinates: string, dialogCorrectWordDe: string, dialogCorrectWordEn: string): IQuestTaskDialogue {
    let coordinatesSplit: string[] = coordinates.split("-");
    let questTask: IQuestTaskDialogue = {
      coordinates: {
        x: new Number(coordinatesSplit[0]) as number,
        y: new Number(coordinatesSplit[1]) as number,
        z: new Number(coordinatesSplit[2]) as number
      },
      correctDialogueWord: {
        [ELocalisation.de]: dialogCorrectWordDe,
        [ELocalisation.en]: dialogCorrectWordEn
      },
      dialogues: {
        [ELocalisation.de]: {},
        [ELocalisation.en]: {}
      },
      type: ETaskType.dialogue
    };

    return questTask;
  }

  addQuestDialog(keyDe: string, keyEn: string, valueDe: string, valueEn: string, questTask: IQuestTaskDialogue) {
    questTask.dialogues[ELocalisation.de][keyDe] = valueDe;
    questTask.dialogues[ELocalisation.en][keyEn] = valueEn;
  }

  updateQuestDialog(originalKey: string, newKey: string, newValue: string, selectedLanguage: 'DE' | 'EN',
      questTask: IQuestTaskDialogue) {

    let localisation: ELocalisation = ELocalisation.de;
    if (selectedLanguage == 'EN') {
      localisation = ELocalisation.en;
    }


    if (originalKey != newKey) {
      delete questTask.dialogues[localisation][originalKey];
    }

    questTask.dialogues[localisation][newKey] = newValue;
  }

  deleteQuestDialog(key: string, selectedLanguage: 'DE' | 'EN', questTask: IQuestTaskDialogue) {
    let localisation: ELocalisation = selectedLanguage == 'DE' ? ELocalisation.de : ELocalisation.en;
    delete questTask.dialogues[localisation][key];
  }

  createQuestStepRewardLicense(componentType: EComponentType, componentId: string, numberOfLicenses: number): IReturnRewardGiveLicense {
    let reward: IReturnRewardGiveLicense = {
      componentType: componentType,
      licenseId: componentId,
      licenses: numberOfLicenses,
      rewardType: EReturnReward.giveLicense
    }

    return reward;
  }

  createQuestStepRewardResources(resources: TResources, credits: number): IReturnRewardGiveResources {
    let reward: IReturnRewardGiveResources = {
      cost: {
        currencies: [credits, 0],
        resources: resources
      },
      rewardType: EReturnReward.giveResources
    }

    return reward;
  }

  deleteStepReward(reward: TReturnReward, questStep: IQuestStep) {
    questStep.rewards = questStep.rewards!.filter(r => r != reward);
  }

  getNpcByRulerName(allNpcs: IQuestPrepareNpcs[], rulerName: string): IQuestPrepareNpcs | null {
    let foundNpcs: IQuestPrepareNpcs[] = allNpcs.filter(n => n.rulerName == rulerName);

    if(foundNpcs.length == 0) {
      return null;
    }

    return foundNpcs[0];
  }

  getNpcByCoordinates(allNpcs: IQuestPrepareNpcs[], coordinates: ICoordinates): IQuestPrepareNpcs | null {
    let foundNpcs: IQuestPrepareNpcs[] = allNpcs.filter(n => n.planet != null &&
        n.planet.coordinates.x == coordinates.x &&
        n.planet.coordinates.y == coordinates.y &&
        n.planet.coordinates.z == coordinates.z);

    if(foundNpcs.length == 0) {
      return null;
    }

    return foundNpcs[0];
  }
}
