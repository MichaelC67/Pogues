import React from 'react';
import { shallow } from 'enzyme';

import SearchCodesLists from './search-codes-lists';

import {
  StatisticalContextCriteria,
  defaultProps as StatisticalContextCriteriaDefaultProps,
} from 'widgets/statistical-context-criteria';

import {
  InputFilterWithCriteria,
  defaultProps as InputFilterWithCriteriaDefaultProps,
} from 'widgets/input-filter-with-criteria';

import { SearchResults } from 'widgets/search-results';

import { DEFAULT_FORM_NAME, TYPES_ITEMS, SEARCH_CRITERIAS, SEARCH_RESULTS_COLUMNS } from 'constants/pogues-constants';

import Dictionary from 'utils/dictionary/dictionary';
import { noop } from 'utils/test/test-utils';

describe('<SearchCodesLists />', () => {
  const selectorPath = 'FAKE_SELECTOR_PATH';

  test('Should render a StatisticalContextCriteria component with the corresponding props', () => {
    const expectedProps = {
      ...StatisticalContextCriteriaDefaultProps,
      formName: DEFAULT_FORM_NAME,
      selectorPath,
      showCampaigns: false,
      horizontal: true,
    };
    const wrapper = shallow(<SearchCodesLists selectorPath={selectorPath} />);

    expect(wrapper.find(StatisticalContextCriteria).props()).toEqual(expectedProps);
  });

  test('Should render a InputFilterWithCriteria component with the corresponding props', () => {
    const expectedProps = {
      ...InputFilterWithCriteriaDefaultProps,
      formName: DEFAULT_FORM_NAME,
      selectorPath,
      typeItem: TYPES_ITEMS.CODES_LIST,
      criterias: SEARCH_CRITERIAS.CODES_LIST,
    };
    const wrapper = shallow(<SearchCodesLists selectorPath={selectorPath} />);

    expect(wrapper.find(InputFilterWithCriteria).props()).toEqual(expectedProps);
  });

  test.only('Should render a SearchResults component with the corresponding props', () => {
    const expectedProps = {
      noValuesMessage: Dictionary.codesListsNoResults,
      columns: SEARCH_RESULTS_COLUMNS.CODES_LIST,
      actions: [
        {
          dictionary: 'searchResultActionReuse',
          action: noop,
        },
      ],
    };
    const wrapper = shallow(<SearchCodesLists selectorPath={selectorPath} />);

    expect(wrapper.find(SearchResults).props()).toEqual(expectedProps);
  });
});
