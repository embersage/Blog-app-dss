import { FC, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { setIsOpenedModalWindow } from '../store/reducers/interfaceSlice';

const DarkBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  top: 0;
  position: fixed;
  z-index: 2;
`;

const ModalBlock = styled.div`
  padding: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  min-height: 320px;
  border-radius: 25px;
  background-color: #fff;
  z-index: 3;
`;

interface IProps {
  children: ReactNode;
}

const ModalWindow: FC<PropsWithChildren<IProps>> = (props) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <DarkBackground
      onClick={() => {
        dispatch(setIsOpenedModalWindow(false));
      }}
    >
      <ModalBlock
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {props.children}
      </ModalBlock>
    </DarkBackground>
  );
};

export default ModalWindow;
