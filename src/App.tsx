import React from 'react';
import { useLoading } from './hooks/useLoading';
import { setupMainAxiosInterceptors } from './libs/main-axios';
import withLoading from './hocs/withLoading';

const AppContent: React.FC = () => {
  // Your app content here
  return <div>Your app content</div>;
};

const AppWithLoading = withLoading(AppContent);

const App: React.FC = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();

  React.useEffect(() => {
    setupMainAxiosInterceptors(startLoading, stopLoading);
  }, [startLoading, stopLoading]);

  return <AppWithLoading isLoading={isLoading} />;
};

export default App; 