import React from 'react';
import s from './Timer.module.css';

export default function Timer({ time, status }) {
  return (
    <>
      <h1 className={s.title}>Timer</h1>
      <div className={s.timer}>
        <div className={s.field}>
          <span className={s.value}>{time}</span>
          <span className={s.label}>{status}</span>
        </div>
      </div>
    </>
  );
}
