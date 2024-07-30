import './App.css';
import { useEffect, useState, useRef } from 'react';

function App() {
  const title = "pomodoro.";
  const [currentTime, setCurrentTime] = useState(new Date());

  const [alarmIsActive, setAlarmIsActive] = useState(false); // Estado para o alarme
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        setCurrentTime(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentTime]);

  const [rounds, setRounds] = useState([0]);
  const [seconds, setSeconds] = useState(1500); // 25min
  const [clockIsActive, setClockIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if(clockIsActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    }
    else if (clockIsActive && seconds === 0) {
        updateRounds();
        playAlarm();
        resetClock();
    }
    else {
        clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [clockIsActive, seconds]);

  const updateRounds = (() => {
    setRounds(rounds => {
      let updatedRounds =  [...rounds];

      if (rounds[rounds.length - 1] === 4) {
        const aux = [1];
        updatedRounds =  [...updatedRounds, ...aux];
      } else {
        updatedRounds[updatedRounds.length - 1] += 1;
      }

      return updatedRounds;
    });
  });

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setAlarmIsActive(true);
    }
  };
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reseta o tempo do áudio
    }
    setAlarmIsActive(false); // Esconde a mensagem e o botão
  };

  const toggleClock = () => {
    setClockIsActive(!clockIsActive);
  };
  const resetClock = () => {
    setClockIsActive(false);
    setSeconds(1500);
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return (
    <>
      <div className="content">
        <MakeTitle title={title} time={currentTime} />
        <div className='app'>
          <div className='pomodoro'>
            <Clock min={minutes} sec={secs} />
            <div className='clockButtons'>
              <button onClick={toggleClock}> <PausePlayIcon activeClock={clockIsActive} />{clockIsActive ? ' Pausar sessão' : ' Iniciar sessão'}</button>
              <button onClick={resetClock}><ReiniciarIcon /> Reiniciar sessão</button>
            </div>
          </div>
          <div className='rounds'>
            <p className='round'>Round {rounds.length}
            <p>Um round é composto por 4 sessões de 25 minutos.
              Ao completar uma sessão, um cafézinho fica registrado.<br/>
              Em sua pausa, faça um novo café e relaxe :)</p>
            </p>
            <div className='coffees-list'>
            {rounds.map((round, _) => (
              <ShowMugs sessionsCount={round} key={_} />
              ))}
            </div> 
          </div>
          <audio ref={audioRef} src="/alarm.wav" preload="auto"></audio>
        </div>
        {alarmIsActive && (
            <div className="alarmMessage">
              <p>Fim da sessão</p>
              <button onClick={stopAlarm}>Parar Alarme</button>
            </div>
          )}
      </div>
    </>
  );
}

// <ShowMugs sessionsCount={rounds[0]} />
//{rounds.map(ShowMugs)}
function Clock({min, sec}) {
  const timeLeft = `${min < 10 ? '0' + min: min}:${sec < 10 ? 0 :''}${sec}`;
  return (
    <div className='clock'>
      <p className='timeLeft'>{timeLeft}</p>
    </div>
  );
} 

function ShowMugs({sessionsCount}) {
  const elements = Array.from({length:sessionsCount}, (_) => (
    <Coffee key={_} />
  ));

  return <div className='coffees'>{elements}</div>;
}

function MakeTitle({title, time}) {
  return <div className='titleBlock'>
    <h1 className='title'>{title}</h1>
    <DateSubtitle today={time} />
  </div>;
}

function DateSubtitle({today}) {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ]
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio',
    'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const now = `${days[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]}`
  const time = `${today.toLocaleString('pt-Br', {timeStyle: 'short'})}`;

  return <div className="subtitle">
    <p className='date'>{now}</p>
    <p className='hour'>{time} <Coffee /></p>
  </div>
}

function Coffee() {
  return <i className="fa-solid fa-mug-saucer"></i>;
}
function PausePlayIcon({activeClock}) {
  if(activeClock) {
    return <i className="fa-solid fa-pause"></i>;
  }
  return <i className="fa-solid fa-play"></i>;
}
function ReiniciarIcon() {
  return <i className="fa-solid fa-stop"></i>;
}

export default App;