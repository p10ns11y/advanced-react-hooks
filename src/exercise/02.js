// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
} from '../pokemon'

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'pending', data: null, error: null}
    }
    case 'resolved': {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {status: 'resolved', data: action.data, error: null}
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {status: 'rejected', data: null, error: action.error}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
// Excercise and Extra credit 1
// function useAsync(asyncCallback, initialValue /* dependencies */) {
//   const [state, dispatch] = React.useReducer(asyncReducer, initialValue)

//   React.useEffect(
//     () => {
//       // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
//       const promise = asyncCallback()
//       if (!promise) {
//         return
//       }
//       // then you can dispatch and handle the promise etc...
//       dispatch({type: 'pending'})
//       promise.then(
//         data => {
//           dispatch({type: 'resolved', data})
//         },
//         error => {
//           dispatch({type: 'rejected', error})
//         },
//       )
//       // 🐨 you'll accept dependencies as an array and pass that here.
//       // 🐨 because of limitations with ESLint, you'll need to ignore
//       // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
//     },
//     [asyncCallback] /*dependencies*/,
//   ) // eslint-disable-line

//   return state
// }

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false)

  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    (...args) => {
      mounted.current ? dispatch(...args) : void 0
    },
    [dispatch],
  )
}

function useAsync(initialValue) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialValue,
  })
  const {status, data, error} = state

  const dispatch = useSafeDispatch(unsafeDispatch)

  const run = React.useCallback(
    promise => {
      dispatch({type: 'pending'})
      promise.then(
        data => {
          dispatch({type: 'resolved', data})
        },
        error => {
          dispatch({type: 'rejected', error})
        },
      )
    },
    [dispatch],
  )

  return {status, data, error, run}
}

function PokemonInfo({pokemonName}) {
  // const asyncCallback = React.useCallback(() => {
  //   if (!pokemonName) {
  //     return
  //   }
  //   return fetchPokemon(pokemonName)
  // }, [pokemonName])
  // 🐨 move both the useReducer and useEffect hooks to a custom hook called useAsync
  // here's how you use it:
  // const state = useAsync(asyncCallback, {
  //   status: pokemonName ? 'pending' : 'idle',
  // })
  // 🐨 so you're job is to create a useAsync function that makes this work.

  // 🐨 this will change from "pokemon" to "data"
  // const {data: pokemon, status, error} = state
  const {data: pokemon, status, error, run} = useAsync({
    status: pokemonName ? 'pending' : 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    return run(fetchPokemon(pokemonName))
  }, [pokemonName, run])

  if (status === 'idle' || !pokemonName) {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

export default App
