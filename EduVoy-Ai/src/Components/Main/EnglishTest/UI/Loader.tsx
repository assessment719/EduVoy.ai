import styled from 'styled-components';

const InsideLoader = ({ text = 'Loading...' }) => {
  return (
    <FullScreenWrapper>
      <StyledWrapper>
        <div className="loader3">
          <div className="circle1" />
          <div className="circle1" />
          <div className="circle1" />
          <div className="circle1" />
          <div className="circle1" />
        </div>
        <div className="loader-text">{text}</div>
      </StyledWrapper>
    </FullScreenWrapper>
  );
};

const FullScreenWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.70);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledWrapper = styled.div`
  text-align: center;

  .loader3 {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
  }

  .circle1 {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 10px;
    background-color: #333;
    animation: circle1 1s ease-in-out infinite;
  }

  .circle1:nth-child(2) {
    animation-delay: 0.2s;
  }

  .circle1:nth-child(3) {
    animation-delay: 0.4s;
  }

  .circle1:nth-child(4) {
    animation-delay: 0.6s;
  }

  .circle1:nth-child(5) {
    animation-delay: 0.8s;
  }

  .loader-text {
    font-size: 1.5rem;
    color: #444;
    font-weight: bold;
  }

  @keyframes circle1 {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export default InsideLoader;