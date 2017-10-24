import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';

import Dictionary from 'utils/dictionary/dictionary';
import CodesListEditorCodes from './codes-list-editor-codes';

const CodesListLabel = ({
  input,
  placeholder,
  type,
  toggleButtonClass,
  toggleCodesList,
  meta: { touched, error, warning },
}) =>
  <div>
    <div className="codes-list__name">
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        onKeyPress={e => {
          return e.charCode === 13 && toggleCodesList();
        }}
      />
      <span className={toggleButtonClass} onClick={() => toggleCodesList()} />
    </div>
    {touched &&
      ((error &&
        <span className="form-error">
          {error}
        </span>) ||
        (warning &&
          <span className="form-warm">
            {warning}
          </span>))}
  </div>;

CodesListLabel.propTypes = {
  input: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  toggleButtonClass: PropTypes.string.isRequired,
  toggleCodesList: PropTypes.func.isRequired,
  meta: PropTypes.object.isRequired,
};

class codesListEditor extends Component {
  static propTypes = {
    optional: PropTypes.bool,
  };
  static defaultProps = {
    optional: false,
  };
  constructor() {
    super();

    this.state = {
      showCodesList: false,
    };
    this.toggleCodesList = this.toggleCodesList.bind(this);
  }
  toggleCodesList() {
    const newShowCodesList = !this.state.showCodesList;
    this.setState({
      showCodesList: newShowCodesList,
    });
  }
  render() {
    const { optional } = this.props;
    const toggleButtonClass = this.state.showCodesList
      ? 'codes-list__show-codes glyphicon glyphicon-eye-close'
      : 'codes-list__show-codes glyphicon glyphicon-pencil';

    return (
      <div className="codes-list-editor">
        <div className="ctrl-input">
          <label htmlFor="input-label">
            {Dictionary.newCl}
          </label>
          <Field
            name="label"
            id="input-label"
            type="text"
            component={CodesListLabel}
            placeholder={Dictionary.newCl}
            toggleButtonClass={toggleButtonClass}
            toggleCodesList={this.toggleCodesList}
            required={!optional}
          />
        </div>
        <FieldArray display={this.state.showCodesList} name="codes" component={CodesListEditorCodes} />
      </div>
    );
  }
}

export default codesListEditor;