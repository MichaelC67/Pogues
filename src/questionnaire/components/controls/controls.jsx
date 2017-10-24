import React, { Component } from 'react';
import { Field, FormSection } from 'redux-form';

import Dictionary from 'utils/dictionary/dictionary';
import Select from 'layout/forms/controls/select';
import Input from 'layout/forms/controls/input';
import ListEntryFormContainer from 'layout/connected-widget/list-entry-form';
import { controlsFormDefault } from 'utils/transformation-entities/control';
import { TextAreaWithVariableAutoCompletion } from 'hoc/withCurrentFormVariables';
import withXPathValidation from 'hoc/withXPathValidation';

const TextAreaWithVariableAndXPathValidation = withXPathValidation(TextAreaWithVariableAutoCompletion);

function validationControl(values) {
  const { label, condition, message } = values;
  const errors = [];

  if (label === '') errors.push(Dictionary.validation_control_label);
  if (condition === '') errors.push(Dictionary.validation_expression);
  if (message === '') errors.push(Dictionary.validation_control_message);

  return errors;
}

function InputControl() {
  const levels = [
    {
      value: 'INFO',
      label: Dictionary.INFO,
    },
    {
      value: 'WARN',
      label: Dictionary.WARN,
    },
    {
      value: 'ERROR',
      label: Dictionary.ERROR,
    },
  ];
  return (
    <div>
      <Field type="text" name="label" id="control_text" component={Input} label={Dictionary.control_label} required />
      <Field
        name="condition"
        id="control_condition"
        help
        component={TextAreaWithVariableAndXPathValidation}
        label={Dictionary.expression}
        required
      />
      <Field
        name="message"
        id="control_message"
        component={TextAreaWithVariableAutoCompletion}
        label={Dictionary.control_message}
        required
      />
      <Field name="type" id="control_type" component={Select} label={Dictionary.type} options={levels} required />
      {/* <Field */}
      {/* name="during_collect" */}
      {/* id="control_during_collect" */}
      {/* component={Checkbox} */}
      {/* label={Dictionary.control_during_collect} */}
      {/* /> */}
      {/* <Field */}
      {/* name="post_collect" */}
      {/* id="control_post_collect" */}
      {/* component={Checkbox} */}
      {/* label={Dictionary.control_post_collect} */}
      {/* /> */}
    </div>
  );
}

class Controls extends Component {
  static selectorPath = 'controls';

  render() {
    const { controls, ...initialInputValues } = controlsFormDefault;
    const inputControlView = <InputControl />;

    return (
      <FormSection name={Controls.selectorPath} className="controls">
        <ListEntryFormContainer
          inputView={inputControlView}
          initialInputValues={initialInputValues}
          selectorPath={Controls.selectorPath}
          validationInput={validationControl}
          listName="controls"
          submitLabel="reset"
          noValueLabel="noControlYet"
        />
      </FormSection>
    );
  }
}

export default Controls;