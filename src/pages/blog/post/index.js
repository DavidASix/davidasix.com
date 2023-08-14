export async function getServerSideProps(context) {
    return {
      redirect: {
        destination: '/blog',
        permanent: false,
      },
    };
  }
  
  export default function Index() {
    return null;
  }