import { Injectable } from '@angular/core';
import { Dictionary, EChassisId, EComponentType, ELocalisation, EModuleId, EReturnReward, ETaskType, ICoordinates, IQuest, IQuestPrepareNpcs, IQuestStep, IQuestSteps, IQuestTaskDialogue, IQuestTaskTransactCredits, IReturnRewardGiveLicense, IReturnRewardGiveResources, TQuestCondition, TQuestTask, TResources, TReturnReward } from './quest-ud.model';

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
        x: new Number(coordinatesSplit[0]).valueOf(),
        y: new Number(coordinatesSplit[1]).valueOf(),
        z: new Number(coordinatesSplit[2]).valueOf()
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

  private raceImages: Dictionary<String> =
  {
    "mensch": "https://universe-dawn.com/_next/static/images/human-421d75471c1f4693f7691222a473acb6.jpg",
    "mosoraner": "https://universe-dawn.com/_next/static/images/mosoraner-df879e29f3d05123f2d696492a298df2.jpg",
    "plentrop": "https://universe-dawn.com/_next/static/images/plentrop-33b63dbd2a45c0aa7fb8fb4c9f8fd7a9.jpg",
    "zuup": "https://universe-dawn.com/_next/static/images/zuup-aa543a0e54d4a107cb8e017bf0ff1de9.jpg",
    "jamozoid": "https://universe-dawn.com/_next/static/images/jamozoid-fb1b7dce73e7839f6a848502cd52e68f.jpg",
    "wegoner": "https://universe-dawn.com/_next/static/images/wegoner-ddd39a9b187cfa85ec7e468193ba586e.jpg",
    "morricaner": "https://universe-dawn.com/_next/static/images/morricaner-e9f66d81695e8a9054117d376013ffdc.jpg",
    "magumer": "https://universe-dawn.com/_next/static/images/magumer-f6ba6d77ae35dc8d9b87c589704c24b9.jpg",
    "ozoid": "https://universe-dawn.com/_next/static/images/ozoid-560248c8d4af70bbc533108606f19737.jpg"
  };

  getRaceImage(race: any) {
    return this.raceImages[race];
  }

  getModuleImage(module: any) {
    return "https://universe-dawn.com/universe-dawn/tech-items/modules/" + EModuleId[module] + ".jpg";
  }

  getChassisImage(chassis: any) {
    return "https://universe-dawn.com/universe-dawn/tech-items/chassi/" + EChassisId[chassis] + ".jpg";
  }

  private buildingImages: Dictionary<String> =
  {
    "hq": "https://universe-dawn.com/_next/static/images/building-hq-4d8cc327b30b53ad91ca61671af7b30e.jpg",
    "shipyard": "https://universe-dawn.com/_next/static/images/building-shipyard-607f5627993ee0623a36e9371abc18d7.jpg",
    "tech": "https://universe-dawn.com/_next/static/images/building-tech-7db46cdc61f67d82e9242277720cc8ac.jpg",
    "academy": "https://universe-dawn.com/_next/static/images/building-academy-74dc3dc1cfb83038065d717cc74e68cb.jpg",
    "comm": "https://universe-dawn.com/_next/static/images/building-comm-db437c56344082bf16831a3a040b7510.jpg",
    "dock": "https://universe-dawn.com/_next/static/images/building-dock-1ac41c6aefbd348d59a775cdb3bed6d1.jpg",
    "gov": "https://universe-dawn.com/_next/static/images/building-gov-f92c78195a2095cbb18555d4ee969ed7.jpg",
    "bunker": "https://universe-dawn.com/_next/static/images/building-bunker-e32d58abb06ca6b0416571a28018bd83.jpg",
    "def": "https://universe-dawn.com/_next/static/images/building-def-3af04afc33a96c595e2b144703840025.jpg"
  };

  getBuildingImage(building: any) {
    return this.buildingImages[building];
  }

  private jobImages: Dictionary<String> =
  {
    "warlord": "https://universe-dawn.com/_next/image?url=%2F_next%2Fstatic%2Fimages%2Fcommandship-fbfef9f0a3dbf7b3adb4a1b28230b260.webp&w=1920&q=75",
    "trader": "https://universe-dawn.com/_next/image?url=%2F_next%2Fstatic%2Fimages%2Fraumstation-green-2-367da7015ffd537014cb385dc2b4fa70.webp&w=1920&q=75",
    "freelancer": "https://universe-dawn.com/_next/image?url=%2F_next%2Fstatic%2Fimages%2Fx-303-su-9a8fabea7cfddec36e9db96138714eb4.webp&w=1920&q=75"
  };

  getJobImage(job: any) {
    return this.jobImages[job];
  }
}
