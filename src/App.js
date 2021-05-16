import React, { useEffect, useState } from 'react';
import { Observable, fromEvent } from 'rxjs';
import { map, buffer, debounceTime, filter, takeUntil } from 'rxjs/operators';
import Timer from './components/Timer';
import Button from './components/Button';
import './index.css';

export default function App() {
  const [time, setTime] = useState('00:00:00');
  const [start, setStart] = useState(false);
  const [state, setState] = useState('stop');
  const [WAIT, setWait] = useState(0);
  const [DATE, setDATE] = useState(Date.now());

  useEffect(() => {
    const click = fromEvent(document, 'click');
    const doubleClick = click.pipe(
      buffer(click.pipe(debounceTime(300))),
      map(list => list.length),
      filter(value => value >= 2),
    );

    const timer = new Observable(observer => {
      const intervalId = setInterval(() => {
        observer.next();
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    });

    const subscription = timer.pipe(takeUntil(doubleClick)).subscribe({
      next: () => {
        switch (state) {
          case 'start':
            setTime(new Date(Date.now() - DATE).toUTCString().slice(17, 25));
            return;
          case 'stop':
            subscription.unsubscribe();
            return;

          default:
            return;
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [state, DATE, WAIT]);

  const startTimer = () => {
    setDATE(Date.now() - WAIT);
    setState('start');
    setStart(true);
    setWait(0);
  };
  const wait = e => {
    if (e.detail === 2) {
      setState('wait');
      setStart(false);
      setWait(Date.now() - DATE);
    }
    return;
  };
  const stop = () => {
    setState('stop');
    setTime('00:00:00');
    setStart(false);
  };
  const reset = () => {
    setDATE(Date.now());
    setTime('00:00:00');
    setWait(0);
  };

  const controls = start ? (
    <Button name="Stop" onClick={stop} />
  ) : (
    <Button name="Start" onClick={startTimer} />
  );
  return (
    <>
      <Timer time={time} startTimer={startTimer} status={state} />
      <div className="btn">
        {controls}
        <Button name="Wait" onClick={wait} />
        <Button name="Reset" onClick={reset} />
      </div>
    </>
  );
}
