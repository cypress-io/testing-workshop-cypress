import React from 'react'
import pluralize from 'pluralize'
import cx from 'classnames'
import { filters } from './filters'

class Footer extends React.Component {
  render () {
    var activeTodoWord = pluralize('item', this.props.count, false)
    var clearButton = null

    if (this.props.completedCount > 0) {
      clearButton = (
        <button
          className='clear-completed'
          onClick={this.props.onClearCompleted}
        >
          Clear completed
        </button>
      )
    }

    // React idiom for shortcutting to `classSet` since it'll be used often
    // var cx = React.addons.classSet
    var nowShowing = this.props.nowShowing
    return (
      <footer className='footer'>
        <span className='todo-count'>
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className='filters'>
          <li>
            <a
              href='#/'
              data-cy='show-all'
              className={cx({ selected: nowShowing === filters.ALL_TODOS })}
            >
              All
            </a>
          </li>{' '}
          <li>
            <a
              href='#/active'
              data-cy='show-active'
              className={cx({ selected: nowShowing === filters.ACTIVE_TODOS })}
            >
              Active
            </a>
          </li>{' '}
          <li>
            <a
              href='#/completed'
              data-cy='show-completed'
              className={cx({
                selected: nowShowing === filters.COMPLETED_TODOS
              })}
            >
              Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    )
  }
}
export default Footer
