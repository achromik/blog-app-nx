import { AnyAction } from '@reduxjs/toolkit';
import { AsyncActionStatus } from '../types';
import {
  PendingAction,
  FulfilledAction,
  RejectedAction,
} from './actionPredicates.types';

export function isFulfilledAction<T>(name: string) {
  return function (action: AnyAction): action is FulfilledAction<T> {
    return (
      action.type.endsWith(AsyncActionStatus.FULFILLED) &&
      action.type.startsWith(name)
    );
  };
}

export function isPendingAction<T>(name: string) {
  return function (action: AnyAction): action is PendingAction<T> {
    return (
      action.type.endsWith(AsyncActionStatus.PENDING) &&
      action.type.startsWith(name)
    );
  };
}

export function isRejectedAction<T>(name: string) {
  return function (action: AnyAction): action is RejectedAction<T> {
    return (
      action.type.endsWith(AsyncActionStatus.REJECTED) &&
      action.type.startsWith(name)
    );
  };
}
