import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const withLoading = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P & { isLoading: boolean }) => {
    const { isLoading, ...restProps } = props;
    
    return (
      <>
        {isLoading && <LoadingSpinner />}
        <WrappedComponent {...(restProps as P)} />
      </>
    );
  };
};

export default withLoading; 