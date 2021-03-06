/**
 *  Copyright (c) Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import * as React from 'react'

export interface Props {
  value: string
  hideGutters?: boolean
}

/**
 * ResultViewer
 *
 * Maintains an instance of CodeMirror for viewing a GraphQL response.
 *
 * Props:
 *
 *   - value: The text of the editor.
 *
 */
export class ResultViewer extends React.Component<Props, {}> {
  private node: any
  private viewer: any

  componentDidMount() {
    // Lazily require to ensure requiring GraphiQL outside of a Browser context
    // does not produce an error.
    const CodeMirror = require('codemirror')
    require('codemirror/addon/fold/foldgutter')
    require('codemirror/addon/fold/brace-fold')
    require('codemirror/addon/dialog/dialog')
    require('codemirror/addon/search/search')
    require('codemirror/keymap/sublime')
    require('codemirror-graphql/results/mode')

    const gutters: any[] = []
    if (!this.props.hideGutters) {
      gutters.push('CodeMirror-foldgutter')
    }
    let foldGutter: any = {}
    if (!this.props.hideGutters) {
      foldGutter = {
        minFoldSize: 4,
      }
    }

    const value = this.props.value || ''

    this.viewer = CodeMirror(this.node, {
      lineWrapping: true,
      value,
      readOnly: true,
      theme: 'graphiql',
      mode: 'graphql-results',
      keyMap: 'sublime',
      foldGutter,
      gutters,
      extraKeys: {
        // Editor improvements
        'Ctrl-Left': 'goSubwordLeft',
        'Ctrl-Right': 'goSubwordRight',
        'Alt-Left': 'goGroupLeft',
        'Alt-Right': 'goGroupRight',
      },
    })
  }

  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value
  }

  componentDidUpdate() {
    const value = this.props.value || ''
    this.viewer.setValue(value)
  }

  componentWillUnmount() {
    this.viewer = null
  }

  render() {
    return (
      <div className="result-codemirror" ref={this.setRef}>
        <style jsx={true}>{`
          .result-codemirror :global(.CodeMirror) {
            @p: .bbox, .pl38;
            background: none;
            position: relative !important;
          }
        `}</style>
      </div>
    )
  }

  setRef = ref => {
    this.node = ref
  }

  /**
   * Public API for retrieving the CodeMirror instance from this
   * React component.
   */
  getCodeMirror() {
    return this.viewer
  }

  /**
   * Public API for retrieving the DOM client height for this component.
   */
  getClientHeight() {
    return this.node && this.node.clientHeight
  }
}
