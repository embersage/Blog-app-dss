import { forwardRef } from 'react';
import styled from 'styled-components';
import { BsEyeFill } from 'react-icons/bs';
import {
  MdOutlineDeleteOutline,
  MdOutlineModeEditOutline,
} from 'react-icons/md';
import IPost from '../models/IPost';

const PostBlockWrapper = styled.div<{ isLarge: boolean }>`
  padding: 20px;
  width: ${(props) => (props.isLarge ? '600px' : '500px')};
  height: ${(props) => (props.isLarge ? '550px' : '')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 10px;
  box-shadow: 0px 0px 10px #eeeeee;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
  position: relative;

  & h2 {
    margin: 0;
    padding: 0;

    font-weight: 600;
  }

  & img {
    width: 400px;
    height: auto;
    max-height: 200px;
    object-fit: contain;
  }

  & p {
    margin: 0;
    padding: 5px;
    max-width: 500px;
    min-height: 200px;
    overflow-y: auto;
    text-align: justify;
  }

  &:hover {
    cursor: ${(props) => (props.isLarge ? '' : 'pointer')};
    transform: ${(props) => (props.isLarge ? '' : 'scale(1.05)')};
    box-shadow: ${(props) => (props.isLarge ? '' : '0px 0px 25px #eeeeee')};
  }
`;

const AdditionalInfo = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 10px;
  }
`;

const Buttons = styled.div`
  top: 10px;
  right: 10px;
  position: absolute;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const Button = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 25px;
  background-color: #fff;
  transition: all 0.3s ease-in-out;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
    background-color: #eee;

    svg {
      color: ${(props) => props.color};
    }
  }
`;

interface IProps {
  ref?: React.Ref<HTMLDivElement>;
  post: IPost;
  onClickHandler?: () => void;
  isLarge: boolean;
  isEditable?: boolean;
  onDeleteHandler?: () => void;
  onEditHandler?: () => void;
}

export type Ref = HTMLDivElement;

const PostBlock = forwardRef<Ref, IProps>((props, ref) => {
  const {
    post,
    onClickHandler,
    isLarge,
    isEditable,
    onDeleteHandler,
    onEditHandler,
  } = props;

  return (
    <PostBlockWrapper ref={ref} onClick={onClickHandler} isLarge={isLarge}>
      <img
        src={
          post.image
            ? `${process.env.REACT_APP_API_URL}/${post.image}`
            : '../assets/image-placeholder.gif'
        }
        alt={post.image}
      />
      <h2>{post.title}</h2>
      {isLarge && <p>{post.text}</p>}
      <AdditionalInfo>
        <span>
          {post.views} <BsEyeFill />
        </span>
        {isEditable && (
          <Buttons>
            <Button onClick={onDeleteHandler} color="#ed1e1d">
              <MdOutlineDeleteOutline />
            </Button>
            <Button onClick={onEditHandler} color="#35c5d4">
              <MdOutlineModeEditOutline />
            </Button>
          </Buttons>
        )}
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </AdditionalInfo>
    </PostBlockWrapper>
  );
});

export default PostBlock;
