import { AsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { AsyncActionStatus } from '../types';

type GenericAsyncThunk<T = unknown, R = unknown> = AsyncThunk<
  T,
  R,
  { state: RootState; rejectValue: R }
>;

export type PendingAction<T> = ReturnType<
  GenericAsyncThunk<T>[AsyncActionStatus.PENDING]
>;
export type RejectedAction<T> = ReturnType<
  GenericAsyncThunk<never, T>[AsyncActionStatus.REJECTED]
>;
export type FulfilledAction<T> = ReturnType<
  GenericAsyncThunk<T>[AsyncActionStatus.FULFILLED]
>;
