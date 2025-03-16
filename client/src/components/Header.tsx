import { FC, useState } from 'react';
import styled from 'styled-components';
import { MdOutlineCreate } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/reducers/userSlice';
import {
  setIsOpenedModalWindow,
  setOrder,
  setPressedButton,
} from '../store/reducers/interfaceSlice';
import Search from './Search';

const HeaderWrapper = styled.header`
  padding: 10px 15px;
  width: 100%;
  top: 0;
  position: sticky;
  z-index: 1;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 10px rgb(233, 233, 233);
`;

const HeaderInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderContent = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1160px;
  position: relative;

  & button {
    margin: 0;
    padding: 0;
    width: 150px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #939393;
    background-color: #fff;
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
    color: #939393;

    & span {
      display: flex;
      justify-content: space-between;
      column-gap: 5px;
    }

    &:hover {
      cursor: pointer;
      border: 2px solid transparent;
      color: #fff;
      background-color: #939393;
    }
  }
`;

const SortPopup = styled.div`
  position: absolute;
  left: 43%;
  top: 100%;
  margin-top: 15px;
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.09);
  border-radius: 10px;
  overflow: hidden;
  padding: 10px 0;
  width: 160px;

  & ul {
    overflow: hidden;

    & li {
      padding: 12px 20px;
      cursor: pointer;
    }
  }
`;

const Header: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.userReducer.data);
  const [sort, setSort] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const variants = [
    { name: 'Сначала новые', field: 'createdAt', order: 'DESC' },
    { name: 'Сначала старые', field: 'createdAt', order: 'ASC' },
    { name: 'Сначала популярные', field: 'views', order: 'DESC' },
    { name: 'Сначала непопулярные', field: 'views', order: 'ASC' },
  ];

  return (
    <HeaderWrapper>
      <HeaderInner>
        <HeaderContent>
          <Search />
          <span>Сортировка: </span>
          <span onClick={() => setIsVisible(!isVisible)}>
            {variants[sort].name}
          </span>
          {isVisible && (
            <SortPopup>
              <ul>
                {variants.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      dispatch(
                        setOrder({ field: item.field, type: item.order })
                      );
                      setSort(index);
                      setIsVisible(false);
                    }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </SortPopup>
          )}
          {userData ? (
            <>
              <button
                onClick={() => {
                  dispatch(setIsOpenedModalWindow(true));
                  dispatch(setPressedButton('articleCreation'));
                }}
              >
                <span>
                  <MdOutlineCreate />
                  Создать статью
                </span>
              </button>
              <button
                onClick={() => {
                  dispatch(logout());
                  localStorage.removeItem('token');
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                dispatch(setIsOpenedModalWindow(true));
                dispatch(setPressedButton('login'));
              }}
            >
              Войти
            </button>
          )}
        </HeaderContent>
      </HeaderInner>
    </HeaderWrapper>
  );
};

export default Header;
