import { AsyncThunk } from '@reduxjs/toolkit';

type GenericAsyncThunk<T = unknown> = AsyncThunk<T, unknown, any>;

export type PendingAction<T> = ReturnType<GenericAsyncThunk<T>['pending']>;
export type RejectedAction<T> = ReturnType<GenericAsyncThunk<T>['rejected']>;
export type FulfilledAction<T> = ReturnType<GenericAsyncThunk<T>['fulfilled']>;
