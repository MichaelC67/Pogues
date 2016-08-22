/* @flow */
//From `getEntityAtCursor.js` in `react-rte`
//Flow does not hurt since we use `react` preset with babel
//Another option was to rely on `getRangesForDraftEntity` (see
// https://github.com/facebook/draft-js/issues/182)
import { EditorState, ContentBlock, Entity } from 'draft-js'

export type EntityDescription = {
  entityKey: string;
  blockKey: string;
  startOffset: number;
  endOffset: number;
};

function getEntityAtOffset(block: ContentBlock, offset: number): ?EntityDescription {
  let entityKey = block.getEntityAt(offset);
  if (entityKey == null) {
    return null;
  }
  let startOffset = offset;
  while (startOffset > 0 && block.getEntityAt(startOffset - 1) === entityKey) {
    startOffset -= 1;
  }
  let endOffset = startOffset;
  let blockLength = block.getLength();
  while (endOffset < blockLength && block.getEntityAt(endOffset + 1) === entityKey) {
    endOffset += 1;
  }
  return entityKey
}

export function getEntityAtCursor(editorState: EditorState): ?EntityDescription {
  let selection = editorState.getSelection();
  let startKey = selection.getStartKey();
  let startBlock = editorState.getCurrentContent().getBlockForKey(startKey);
  let startOffset = selection.getStartOffset();
  if (selection.isCollapsed()) {
    // Get the entity before the cursor (unless the cursor is at the start).
    return getEntityAtOffset(startBlock, startOffset === 0 ? startOffset : startOffset - 1);
  }
  if (startKey !== selection.getEndKey()) {
    return null;
  }
  let endOffset = selection.getEndOffset();
  let startEntityKey = startBlock.getEntityAt(startOffset);
  for (let i = startOffset; i < endOffset; i++) {
    let entityKey = startBlock.getEntityAt(i);
    if (entityKey == null || entityKey !== startEntityKey) {
      return null;
    }
  }
  return startEntityKey
}
