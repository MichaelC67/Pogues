import React, { PropTypes, Component } from 'react'
import {
  Editor, EditorState, RichUtils, convertToRaw, Entity, Modifier,
  CompositeDecorator
} from 'draft-js'
import { stateToMarkdown } from 'draft-js-export-markdown'
import { stateFromMarkdown } from 'draft-js-import-markdown'
import RichControlGroup from './rich-control-group'
import ContextualInput from './contextual-input'
import Link, { createLinkEntity, findLinkEntities } from './rich-label-link'
import Icon, { createIconEntity, findIconEntities } from './rich-label-icon'
//default styles for the editor (we need this at least to make the placeholder behave as expected)
import '../../css/Draft.css'
import classnames from 'classnames'
import _ from 'lodash'
import { getEntitySelectionState } from '../utils/get-entity-selection'
import { getEntityAtCursor } from '../utils/get-entity-at-cursor'
const STYLES = {
  BOLD: 'BOLD',
  ITALIC: 'ITALIC'
}
const { BOLD, ITALIC } = STYLES
const LINK = 'LINK'

// console.log(convertToRaw(this.state.editorState.getCurrentContent()))
// console.log(stateToMarkdown(this.state.editorState.getCurrentContent()))
/**
 * We decoupled the Editor and the controls to enable fine grained positioning.
 */
export default class RichLabel extends Component {
  
  constructor(props) {
    super(props)
    const editorState = EditorState.createWithContent(
      stateFromMarkdown(props.initialValue),
      new CompositeDecorator([{
        strategy: findLinkEntities,
        component: Link
      }, {
        strategy: findIconEntities,
        component: Icon
      }])
    )
    const content = editorState.getCurrentContent()
      
    this.state = {
      focus: false,
      editorState,
      linkEdited: false,
      linkInfo: '',
      iconEdited: false,
      iconInfo: '',
      content
    }
    this.onChange = (editorState) => {
      this.setState({ editorState })
      const newContent = editorState.getCurrentContent()
      if (newContent === this.state.content) return
      props.onChange(stateToMarkdown(newContent))
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.linkFocus = () => {}
    this.iconFocus = () => {}
    
    this.toggleLink = () => {
      const { editorState } = this.state;
      const selection = editorState.getSelection()
      const content = editorState.getCurrentContent()
      const entityKey = getEntityAtCursor(editorState)
      let url = ''
      if (entityKey) {
        const entity = Entity.get(entityKey)
        if (entity.getType() === 'LINK') url = entity.getData().url
      }
      if (!selection.isCollapsed()) {
        this.setState({
          linkEdited: true,
          linkInfo: url,
        }, () => {
          setTimeout(this.linkFocus(), 0);
        });
      }
    }
    this.confirmLink = () => {
      const { editorState, linkInfo } = this.state
      const entityKey = createLinkEntity(linkInfo)
      this.setState({
        editorState: RichUtils.toggleLink(
          editorState,
          editorState.getSelection(),
          entityKey
        ),
        linkEdited: false,
        linkInfo: '',
      }, () => {
        setTimeout(() => {
          this.refs.editor.focus()
        }, 0)
      });
    }
    
    this.toggleIcon = () => {
      const { editorState } = this.state;
      const selection = editorState.getSelection()
      const content = editorState.getCurrentContent()
      const entityKey = getEntityAtCursor(editorState)
      let info = ''
      if (entityKey) {
        const entity = Entity.get(entityKey)
        if (entity.getType() === 'ICON') info = entity.getData().info
      }
      if (!selection.isCollapsed()) {
        this.setState({
          iconEdited: true,
          iconInfo: info,
        }, () => {
          setTimeout(this.iconFocus(), 0);
        });
      }
    }
    this.confirmIcon = () => {  
      const { editorState, iconInfo } = this.state
      const entityKey = createIconEntity(iconInfo)
      const modif = Modifier.applyEntity(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        entityKey)
      const newEditorState = EditorState.push(editorState, modif, 'apply-entity')
      this.setState({
        editorState: newEditorState,
        iconEdited: false,
        iconInfo: '',
      }, () => {
        setTimeout(() => {
          this.refs.editor.focus()
          console.log(convertToRaw(newEditorState.getCurrentContent()))
        }, 0)
      });
    }
    
    this.controlActions = {
      BOLD: {
        toggle: this.toggleInlineStyle.bind(this, BOLD),
        isSet: () => this.state.editorState.getCurrentInlineStyle().has(BOLD)
      },
      ITALIC: {
        toggle: this.toggleInlineStyle.bind(this, ITALIC),
        isSet: () => this.state.editorState.getCurrentInlineStyle().has(ITALIC)
      },
      LINK: {
        toggle: this.toggleLink,
        isSet: () => this.state.linkEdited
      },
      ICONE: {
        toggle: this.toggleIcon,
        isSet: () => this.state.iconEdited
      }
    }
    this.linkInfoChange = text => this.setState({ linkInfo: text })
    this.iconInfoChange = text => this.setState({ iconInfo: text })
  }
  
  toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
  
  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  } 
     
  render() {
    const {
      editorState, focus, linkEdited, linkInfo, iconEdited, iconInfo
    } = this.state
    const { locale, placeholder, canPaste, multiline } = this.props
    return (
      <div className="rich-label">
        <div className="rich-label-control-group">
          <RichControlGroup className="btn-group btn-group-xs"
            controls={this.controlActions} locale={locale} />
            { linkEdited &&
            <div className="rich-label-contextual-input">
              <ContextualInput
                text={linkInfo}
                placeholder={'Entrez une url'}
                onChange={this.linkInfoChange}
                onEnter={this.confirmLink} />
              <a className="btn btn-xs btn-default" onClick={this.confirmLink}
                style={{ marginLeft: '5px' }}>
                <i className="fa fa-check"></i>
              </a>
            </div>
            }
            { iconEdited &&
              <div className="rich-label-contextual-input">
                <ContextualInput
                  text={iconInfo}
                  placeholder={'Entrez une information'}
                  onChange={this.iconInfoChange}
                  onEnter={this.confirmIcon} />
                <a className="btn btn-xs btn-default" onClick={this.confirmIcon}
                  style={{ marginLeft: '5px' }}>
                  <i className="fa fa-check"></i>
                </a>
              </div>
            }     
        </div>
        <div className={classnames('form-control', { multiline, focus })}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false})}>
          <Editor 
            handlePastedText={(text, html) => {
              //TODO replace with newlines with whitespaces, and then update
              //editorState
              return false
            }}
            // disable new lines
            //handleReturn={() => multiline}
            placeholder={placeholder}
            ref='editor'
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}/>
        </div>
      </div>
    )
  }
}

RichLabel.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValue: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  canPaste: PropTypes.bool.isRequired,
  multiline: PropTypes.bool.isRequired,
  locale: PropTypes.object.isRequired
}