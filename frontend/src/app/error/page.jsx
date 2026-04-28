import ErrorPage from './Error';

export const metadata = {
  title: 'Page introuvable - MinoStore',
  description: 'La page que vous recherchez n\'existe pas',
};

export default function Page() {
  return <ErrorPage />;
}