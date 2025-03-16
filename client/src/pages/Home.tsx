import {
  FC,
  useEffect,
  useState,
  MouseEvent,
  useRef,
  FormEvent,
  ChangeEvent,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';
import { AppDispatch, RootState } from '../store';
import { login, register } from '../store/reducers/userSlice';
import {
  createPost,
  editPost,
  deletePost,
  fetchPost,
  fetchPosts,
  setPost,
  uploadImage,
} from '../store/reducers/postsSlice';
import PostBlock from '../components/PostBlock';
import IPost from '../models/IPost';
import ModalWindow from '../components/ModalWindow';
import {
  setIsOpenedModalWindow,
  setPressedButton,
} from '../store/reducers/interfaceSlice';

const ContentWrapper = styled.main`
  padding: 0 15px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  width: 100%;
`;

const PostBlockWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
`;

const FormWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;

  & h2 {
    margin: 0;
  }

  & label {
    width: 270px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & input {
      padding: 5px;
      border-radius: 8px;
      width: 200px;
      height: 40px;
      outline: none;
      border: 2px solid #ededed;
      transition: all 0.3s ease-in-out;

      &:focus {
        border: 2px solid #dddddd;
      }
    }
  }

  & button {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #939393;
    background-color: #fff;
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
    color: #939393;

    &:hover {
      cursor: pointer;
      border: 2px solid transparent;
      color: #fff;
      background-color: #939393;
    }
  }
`;

const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  row-gap: 10px;

  & input {
    padding: 5px;
    width: 100%;
    height: 40px;
    border: 2px solid #ededed;
    border-radius: 10px;
    outline: none;
    transition: all 0.3s ease-in-out;

    &:focus {
      border: 2px solid #dddddd;
    }
  }

  & textarea {
    padding: 5px;
    resize: none;
    width: 100%;
    height: 150px;
    border: 2px solid #ededed;
    border-radius: 10px;
    outline: none;
    transition: all 0.3s ease-in-out;

    &:focus {
      border: 2px solid #dddddd;
    }
  }
`;

const FullArticle = styled.div`
  position: sticky;
  top: 100px;
`;

const SwitchButton = styled.button``;

const Home: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.userReducer.data);
  const post = useSelector((state: RootState) => state.postsReducer.post);
  const posts = useSelector((state: RootState) => state.postsReducer.posts);
  const isOpenedModalWindow = useSelector(
    (state: RootState) => state.interfaceReducer.isOpenedModalWindow
  );
  const search = useSelector(
    (state: RootState) => state.interfaceReducer.search
  );
  const pressedButton = useSelector(
    (state: RootState) => state.interfaceReducer.pressedButton
  );
  const order = useSelector((state: RootState) => state.interfaceReducer.order);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [modalContent, setModalContent] = useState('authorization');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFullArticle, setIsLoadingFullArticle] = useState(true);
  const largePostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await dispatch(fetchPosts({ search, order }));
      if (response.payload) {
        setIsLoading(false);
      }
    })();

    const handleClickOutside = (event: Event) => {
      if (
        largePostRef.current &&
        !event.composedPath().includes(largePostRef.current)
      ) {
        dispatch(setPost(null));
        setIsLoadingFullArticle(true);
      }
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [search, order]);

  const authClickHandler = async (event: MouseEvent) => {
    event.preventDefault();
    if (modalContent === 'authorization') {
      const response = await dispatch(login({ email, password }));
      if (!response.payload) {
        return alert('Не удалось авторизоваться.');
      }
      if ('token' in response.payload) {
        localStorage.setItem('token', response.payload.token);
      }
    } else if (name.length > 0 && email.length > 0 && password.length > 0) {
      const response = await dispatch(register({ name, email, password }));
      if (!response.payload) {
        return alert('Не удалось зарегистрироваться.');
      }
      if ('token' in response.payload) {
        localStorage.setItem('token', response.payload.token);
      }
    }

    if (localStorage.getItem('token')) {
      dispatch(setIsOpenedModalWindow(false));
      setName('');
      setEmail('');
      setPassword('');
    }
  };

  const createPostClickHandler = async (event: MouseEvent) => {
    event.preventDefault();
    if (title.length > 0 && text.length > 0) {
      if (pressedButton === 'articleCreation') {
        await dispatch(createPost({ title, text, image }));
      } else {
        await dispatch(editPost({ id, title, text, image }));
        await dispatch(fetchPost(id));
      }

      await dispatch(fetchPosts({ search, order }));
      dispatch(setIsOpenedModalWindow(false));
      setTitle('');
      setText('');
      setImage('');
      setPassword('');
    }
  };

  return (
    <>
      <ContentWrapper>
        <PostBlockWrapper>
          {!isLoading && posts
            ? posts.map((item: IPost) => {
                return (
                  <PostBlock
                    key={item.id}
                    post={item}
                    onClickHandler={async () => {
                      await dispatch(fetchPost(item.id));
                      setIsLoadingFullArticle(false);
                    }}
                    isLarge={false}
                    isEditable={user?.id === item.user.id}
                    onDeleteHandler={async () => {
                      await dispatch(deletePost(item.id));
                      await dispatch(fetchPosts({ search, order }));
                    }}
                    onEditHandler={async () => {
                      await dispatch(setIsOpenedModalWindow(true));
                      await dispatch(setPressedButton('articleEditing'));
                      setId(item.id);
                      setTitle(item.title);
                      setText(item.text);
                    }}
                  />
                );
              })
            : new Array(10).fill(undefined).map((_, index) => {
                return (
                  <ContentLoader
                    key={index}
                    speed={2}
                    width={500}
                    height={330}
                    viewBox="0 0 500 330"
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <rect
                      x="0"
                      y="0"
                      rx="20"
                      ry="20"
                      width="500"
                      height="330"
                    />
                  </ContentLoader>
                );
              })}
        </PostBlockWrapper>
        {!isLoadingFullArticle && (
          <FullArticle>
            {post ? (
              <PostBlock ref={largePostRef} post={post} isLarge={true} />
            ) : (
              <ContentLoader
                speed={2}
                width={600}
                height={550}
                viewBox="0 0 600 550"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="20" ry="20" width="600" height="550" />
              </ContentLoader>
            )}
          </FullArticle>
        )}
      </ContentWrapper>
      {isOpenedModalWindow && (
        <ModalWindow>
          {pressedButton === 'login' && (
            <FormWrapper>
              <h2>
                {modalContent === 'authorization' ? 'Вход' : 'Регистрация'}
              </h2>
              {modalContent === 'registration' && (
                <label>
                  <span>Имя:</span>
                  <input
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    type="text"
                  />
                </label>
              )}
              <label>
                <span>Email:</span>
                <input
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  type="email"
                />
              </label>
              <label>
                <span>Пароль:</span>
                <input
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  type="password"
                />
              </label>
              <button
                type="submit"
                onClick={(event: MouseEvent) => authClickHandler(event)}
              >
                {modalContent === 'authorization'
                  ? 'Войти'
                  : 'Зарегистрироваться'}
              </button>
              <SwitchButton
                onClick={(event) => {
                  event.preventDefault();
                  modalContent === 'authorization'
                    ? setModalContent('registration')
                    : setModalContent('authorization');
                }}
              >
                {modalContent === 'authorization'
                  ? 'Нет аккаунта? Зарегистрируйтесь!'
                  : 'Уже есть аккаунт? Авторизуйтесь!'}
              </SwitchButton>
            </FormWrapper>
          )}
          {(pressedButton === 'articleCreation' ||
            pressedButton === 'articleEditing') && (
            <FormWrapper>
              <h2>
                {pressedButton === 'articleCreation'
                  ? 'Создание записи'
                  : 'Редактирование записи'}
              </h2>
              <TextWrapper>
                <span>Название:</span>
                <input
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  type="text"
                />
              </TextWrapper>
              <TextWrapper>
                <span>Текст:</span>
                <textarea
                  value={text}
                  onChange={(event) => {
                    setText(event.target.value);
                  }}
                />
              </TextWrapper>
              <TextWrapper>
                <input
                  type="file"
                  onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.files) {
                      const formData = new FormData();
                      formData.append('image', event.target.files[0]);
                      const response = await dispatch(uploadImage(formData));
                      setImage(response.payload.url);
                    }
                  }}
                />
              </TextWrapper>
              <button
                type="submit"
                onClick={(event: MouseEvent) => createPostClickHandler(event)}
              >
                {pressedButton === 'articleCreation'
                  ? 'Опубликовать'
                  : 'Изменить'}
              </button>
            </FormWrapper>
          )}
        </ModalWindow>
      )}
    </>
  );
};

export default Home;
