// The intent of this file is to collect functions and interfaces used when
// dealing with redux.
//
// It also contains a handful of "app-specific" interfaces, which are the redux
// ones with the generic StoreShape and Action types set to the ones used in
// our app.

import {
  connect as originalConnect,
  InferableComponentEnhancerWithProps,
  MapStateToProps,
  MapStateToPropsParam,
} from 'react-redux'
import {
  Action,
  Dispatch,
} from 'redux'
/**
 * Base Flux action with generic types for payload and meta.
 * @export
 * @interface FluxAction
 * @extends {Action}
 * @template TPayload
 * @template TMeta
 */
export interface FluxAction<TPayload = any, TMeta = any> extends Action {
  payload: TPayload
  meta?: TMeta
  error?: boolean
}

export { RootStore } from './redux/rootReducer'
import { RootStore } from './redux/rootReducer'

/**
 * App-specific interface for dispatching actions.
 * @export
 * @interface AppDispatch
 * @extends {Dispatch<Action>}
 */
export interface AppDispatch extends Dispatch<Action> {}

/**
 * App-specific interface to be extended by component props.
 * @export
 * @interface AppDispatchProps
 */
export interface AppDispatchProps {
  dispatch: AppDispatch
}

export interface AppGetState {
  (): RootStore
}

/**
 * App-specific interface for `action.payload` functions.
 * @export
 * @interface AppPayloadFunction
 */
export interface AppPayloadFunction<T> {
  (dispatch: AppDispatch, getState: AppGetState): T
}

// export interface AppAction {
//   (...args: any[]): FluxAction<any, any>
// }

/**
 * App-specific interface for actions with a payload function.
 * @export
 * @interface AppAsyncAction
 */
// tslint:disable-next-line:max-line-length
export interface AppAsyncAction<T = any, TMeta = any> extends FluxAction<AppPayloadFunction<T>, TMeta> {
}

/**
 * App-specific interface for actions with a payload function and meta.
 * @export
 * @interface AppAsyncMetaAction
 * @template TMeta
 */
// tslint:disable-next-line:max-line-length
// export interface AppAsyncMetaAction<TMeta> extends FluxAction<AppPayloadFunction<T>, TMeta> {
// }

/**
 * App-specific interface for `mapStateToProps`.
 * @export
 * @interface AppConnector
 * @template TStateProps
 * @template TOwnProps
 */
export interface AppConnector<TStateProps, TOwnProps = {}> extends MapStateToProps<
  TStateProps,
  TOwnProps,
  RootStore
> {}

interface AppConnect {
  <TStateProps = {}, TOwnProps = {}, TDispatchProps = {}>(
    mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, RootStore>,
    mapDispatchToProps?: TDispatchProps | ((...args: any[]) => TDispatchProps),
  ): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>
}

export const connect = originalConnect as AppConnect
