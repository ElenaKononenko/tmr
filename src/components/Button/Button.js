import React from 'react';
import s from './Button.module.css';

export default function Button({ name, onClick }) {
  return (
    <>
      <button type="button" className={s.Btn} onClick={onClick}>
        {name}
      </button>
    </>
  );
}
