import React, { Component, PropTypes } from 'react'
import QuestionLabel from './question-label'
import SequenceLabel from './sequence-label'
import ToolsActivator from './tools-activator'
import classnames from 'classnames'

import { COMPONENT_TYPE } from '../constants/pogues-constants'
const { QUESTION, SEQUENCE } = COMPONENT_TYPE

export default function QuestionOrSequenceHeader(props) {
  const {
   type, isDragging, id, label, depth, connectDragSource
  } = props

  const cl = classnames(
    'header-container tools-activator-container',
    isDragging && 'isDragging')
  const Label = type === QUESTION ? QuestionLabel : SequenceLabel
  return (
    <div className={cl} >
      <ToolsActivator {...props} /> 
      {connectDragSource(
        <span>
          <Label {...props} />
        </span>
      )}
    </div>
  )
}

QuestionOrSequenceHeader.propTypes = {

}


