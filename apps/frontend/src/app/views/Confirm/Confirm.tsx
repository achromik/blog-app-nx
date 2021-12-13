import { Button, Result, Row } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppRoutes } from '../../config';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { confirm } from '../../store/auth/auth.actions';
import { StoreNamespace } from '../../store/types';

export const Confirm: React.FC = () => {
  const { confirmToken } = useParams();
  const [success, setSuccess] = useState(false);

  const { error } = useAppSelector((state) => state[StoreNamespace.AUTH]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (confirmToken) {
      const confirmEmail = async () => {
        const resultAction = await dispatch(confirm({ confirmToken }));
        if (confirm.fulfilled.match(resultAction)) {
          setSuccess(true);
        }
      };

      confirmEmail();
    }
  }, [confirmToken, dispatch]);

  return (
    <Row style={{ height: '100vh' }} justify="center" align="middle">
      {success && (
        <Result
          status="success"
          title="Successfully Verified Email!"
          subTitle="You can now login to our app!"
          extra={
            <Button type="primary">
              <Link to={AppRoutes.login}>Go Login</Link>
            </Button>
          }
        />
      )}
      {error && (
        <Result
          status="error"
          title="Unsuccessfully Verified Email!"
          extra={<Button>Resend Verification Email</Button>}
        />
      )}
    </Row>
  );
};
