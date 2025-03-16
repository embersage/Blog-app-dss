import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { setSearch } from '../store/reducers/interfaceSlice';
import { AppDispatch } from '../store';

const SearchComponent = styled.input`
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
`;

const Search = () => {
  const [string, setString] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const updateSearch = useCallback(
    debounce((search: string) => {
      dispatch(setSearch(search));
    }, 250),
    []
  );

  return (
    <SearchComponent
      value={string}
      onChange={(event) => {
        setString(event.target.value);
        updateSearch(event.target.value);
      }}
      placeholder="Поиск..."
    />
  );
};

export default Search;
