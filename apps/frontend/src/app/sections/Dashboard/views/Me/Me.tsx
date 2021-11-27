import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { ErrorResponse } from '@libs/types';
import { http } from '../../../../services/http';

export const Me: React.FC = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await http.get<any>('user/me');

        setUser(res);
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.message);
        }
      }
    };
    fetchMe();
  }, []);

  return (
    <p>
      {!error && JSON.stringify(user)}
      {error}
    </p>
  );
};

function isAxiosError(err: unknown): err is AxiosError<ErrorResponse> {
  return !!(err as AxiosError<ErrorResponse>).response?.data.message;
}
