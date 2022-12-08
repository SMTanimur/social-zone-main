import { GetServerSidePropsContext } from 'next';

export const withAuthRedirect =
  (gssp: any) => async (context: GetServerSidePropsContext) => {
    const { req } = context;

    const token = req.cookies['green_sid'];

    if (!token) {
      return { ...(await gssp(context)) };
    } else {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  };
