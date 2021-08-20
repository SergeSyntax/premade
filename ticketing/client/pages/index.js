import { buildClient } from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  // axios.get('/api/users/current-user').catch(console.error);
  return <h1>{currentUser ? 'signed in' : 'not signed in'}</h1>;
};

LandingPage.getInitialProps = async () => {
  console.log('happen');
};

// export async function getServerSideProps(context) {
//   console.log(Object.keys(context));
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

export default LandingPage;
