import {
  QUESTION_TYPE_ENUM,
  DIMENSION_TYPE,
  DIMENSION_FORMATS,
  CODES_LIST_INPUT_ENUM,
} from 'constants/pogues-constants';
import { uuid } from 'utils/data-utils';

const { SIMPLE, SINGLE_CHOICE, MULTIPLE_CHOICE, TABLE } = QUESTION_TYPE_ENUM;
const { PRIMARY, SECONDARY, MEASURE, LIST_MEASURE } = DIMENSION_TYPE;
const { CODES_LIST } = DIMENSION_FORMATS;
const { NEW, QUESTIONNAIRE } = CODES_LIST_INPUT_ENUM;

export function getCollecteVariable(name, label) {
  return {
    id: uuid(),
    name,
    label,
  };
}

export function getCollectedVariablesMultiple(questionName, form, codesListStore) {
  const { [PRIMARY]: { [NEW]: { codes }, [QUESTIONNAIRE]: { codesListId } } } = form;
  let listCodes = codes;

  if (codesListId) {
    const codesStore = codesListStore[codesListId].codes;
    listCodes = Object.keys(codesStore).map(key => codesStore[key]);
  }

  return listCodes.map((c, index) => getCollecteVariable(`${questionName}${index + 1}`, `${c.code} - ${c.label}`));
}

export function getCollectedVariablesTable(questionName, form, codesListStore) {
  const collectedVariables = [];
  let codesListState;
  let codesStore;
  let codesStatePrimary;
  let codesStateSecondary;
  let codePrimary;
  let codeSecondary;
  let measure;
  const {
    [PRIMARY]: primaryState,
    [SECONDARY]: secondaryState,
    [MEASURE]: measureState,
    [LIST_MEASURE]: listMeasuresState,
  } = form;

  if (primaryState.type === CODES_LIST) {
    const {
      [CODES_LIST]: {
        codesListId: codesListIdPrimary,
        [NEW]: { codes: componentCodesStatePrimary },
        [QUESTIONNAIRE]: { codesListId: componentCodesListIdPrimary },
      },
    } = primaryState;

    codesListState = codesListStore[codesListIdPrimary] || codesListStore[componentCodesListIdPrimary] || {};
    codesStore = codesListState.codes || {};
    codesStatePrimary = Object.keys(codesStore).map(key => codesStore[key]);
    if (codesStatePrimary.length === 0) codesStatePrimary = componentCodesStatePrimary;

    if (secondaryState.showSecondaryAxis) {
      const {
        codesListId: codesListIdSecondary,
        [NEW]: { codes: componentCodesStateSecondary },
        [QUESTIONNAIRE]: { codesListId: componentCodesListIdSecondary },
      } = secondaryState;

      codesListState = codesListStore[codesListIdSecondary] || codesListStore[componentCodesListIdSecondary] || {};
      codesStore = codesListState.codes || {};
      codesStateSecondary = Object.keys(codesStore).map(key => codesStore[key]);
      if (codesStateSecondary.length === 0) codesStateSecondary = componentCodesStateSecondary;

      // First case
      for (let i = 0; i < codesStatePrimary.length; i += 1) {
        codePrimary = codesStatePrimary[i];
        for (let j = 0; j < codesStateSecondary.length; j += 1) {
          codeSecondary = codesStateSecondary[j];
          collectedVariables.push(
            getCollecteVariable(
              `${questionName}${i + 1}${j + 1}`,
              `${codePrimary.label}-${codeSecondary.label}-${measureState.label}`
            )
          );
        }
      }
    } else {
      // Second case
      for (let i = 0; i < codesStatePrimary.length; i += 1) {
        codePrimary = codesStatePrimary[i];
        for (let j = 0; j < listMeasuresState.measures.length; j += 1) {
          measure = listMeasuresState.measures[j];
          collectedVariables.push(
            getCollecteVariable(`${questionName}${i + 1}${j + 1}`, `${codePrimary.label}-${measure.label}`)
          );
        }
      }
    }
  } else {
    const { LIST: { numLinesMin, numLinesMax } } = primaryState;
    const numLines = numLinesMax - numLinesMin + 1;

    // Third case
    for (let i = 0; i < numLines; i += 1) {
      for (let j = 0; j < listMeasuresState.measures.length; j += 1) {
        measure = listMeasuresState.measures[j];
        collectedVariables.push(
          getCollecteVariable(`${questionName}${i + 1}${j + 1}`, `Line${i + 1}-${measure.label}`)
        );
      }
    }
  }

  return collectedVariables;
}

export function generateCollectedVariables(responseFormat, questionName, form, codesListStore) {
  let generatedCollectedVariables = [];

  if (responseFormat === SIMPLE || responseFormat === SINGLE_CHOICE) {
    generatedCollectedVariables = [getCollecteVariable(questionName, `${questionName} label`)];
  } else if (responseFormat === MULTIPLE_CHOICE) {
    generatedCollectedVariables = getCollectedVariablesMultiple(questionName, form, codesListStore);
  } else if (responseFormat === TABLE) {
    generatedCollectedVariables = getCollectedVariablesTable(questionName, form, codesListStore);
  }

  return generatedCollectedVariables;
}