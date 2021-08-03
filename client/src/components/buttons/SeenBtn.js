import React from 'react';
import { useDispatch } from 'react-redux';
import { addMovieSeen, deleteMovieSeen } from '../../store/movie';

export default function SeenBtn({ id, title, seen, setSeen, hide }) {
  const dispatch = useDispatch();

  const handleSeen = (e, inSeen) => {
    e.preventDefault();
    setSeen(inSeen);
    inSeen ? dispatch(addMovieSeen(id, title)) : dispatch(deleteMovieSeen(id, title));
  };

  if (hide) return <div></div>;

  return (
    <button
      className="font-bold text-opacity-2 z-50"
      aria-label="add to watchlist"
      onClick={(e) => handleSeen(e, true)}
    >
      <span className="material-icons">check</span>
    </button>
  );
}
