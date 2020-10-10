// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import React from 'react'

// Simple
// function countReducer(state, action) {
//   return action
// }

// Extra credit 1
// function countReducer(state, action) {
//   return state + action
// }

// Extra credit 2
// function countReducer(state, action) {
//   return {
//     ...state,
//     ...action,
//   }
// }

// Extra credit 3
// function countReducer(state, action) {
//   if (typeof action === 'function') {
//     return action(state)
//   }

//   return {
//     ...state,
//     ...action,
//   }
// }

// Extra credit 4
function countReducer(state, action) {
  if (action.type === 'INCREMENT') {
    return {
      ...state,
      count: state.count + action.step,
    }
  }

  return state
}

function Counter({initialCount = 0, step = 1}) {
  // 🐨 replace React.useState with React.useReducer.
  // 💰 React.useReducer(countReducer, initialCount)
  const [state, dispatch] = React.useReducer(countReducer, {
    count: initialCount,
  })
  const {count} = state

  // 💰 you can write the countReducer function so you don't have to make any
  // changes to the next two lines of code! Remember:
  // The 1st argument is called "state" - the current value of count
  // The 2nd argument is called "action" - the value passed to setCount
  // const increment = () => setCount(count + step)
  // const increment = () => changeCount(step)
  // const increment = () => setState({count: count + step})
  // const increment = () =>
  //   setState(currentState => ({count: currentState.count + step}))
  const increment = () => dispatch({type: 'INCREMENT', step})

  return <button onClick={increment}>{count}</button>
}

function App() {
  return <Counter />
}

export default App
