import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoadingContainer>
      <Spin size="large" />
    </LoadingContainer>
  );
};

export default LoadingSpinner; 