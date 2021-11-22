import Axios from 'axios';
import { api } from 'config';

export const http = Axios.create({
  baseURL: api.baseURL,
  headers: { 'Content-Type': 'application/json' },
});
