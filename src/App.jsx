import { FaTwitter, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./App.css";

const agentPool = [
  { name: "@Lukex", image: "/Lukex.png" },
  { name: "@0xniccomi", image: "/0xniccomi.png" },
  { name: "@jjidol", image: "/jjidol.png" },
  { name: "@kgmyatthu", image: "/kgmyatthu.png" },
  { name: "@btcnohime", image: "/btcnohime.png" },
  { name: "@frantick", image: "/frantick.png" },
  { name: "imacryptopotato", image: "/imacryptopotato.png" }
];

function shuffleAgents() {
  const doubled = [...agentPool, ...agentPool];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export default function App() {
  const [agents, setAgents] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [hasWon, setHasWon] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const clickSound = new Audio("/click.mp3");
  const matchSound = new Audio("/match.mp3");
  const failSound = new Audio("/fail.mp3");
  const winSound = new Audio("/win.mp3");

  useEffect(() => {
    setAgents(shuffleAgents());
  }, []);

  useEffect(() => {
    if (matched.length === 14) {
      setHasWon(true);
      if (!isMuted) winSound.play();
      import("canvas-confetti").then((module) => {
        const confetti = module.default;
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 }
        });
      });
    }
  }, [matched, isMuted]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index) || isPaused) return;

    if (!isMuted) clickSound.play();

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (agents[first].name === agents[second].name) {
        setTimeout(() => {
          if (!isMuted) matchSound.play();
          setMatched((prev) => [...prev, first, second]);
        }, 400);
      } else {
        setTimeout(() => {
          if (!isMuted) failSound.play();
        }, 300);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  const handlePlayAgain = () => {
    setAgents(shuffleAgents());
    setFlipped([]);
    setMatched([]);
    setHasWon(false);
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const togglePause = () => setIsPaused(!isPaused);

  const shareText = encodeURIComponent("🎉 I just WON the @satlayer Team Flip memory game! You can play it here:");
  const shareURL = encodeURIComponent("https://satlayer-team-flip.vercel.app");
  const tweetLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareURL}`;

  return (
    <div className="game">
      <div className="background-blur"></div>
      <div className="background-overlay"></div>

      {/* Controls */}
     <div className="top-right-buttons">
  <button onClick={togglePause} className="pause-button">
    {isPaused ? '▶' : '⏸'}
  </button>
  <button onClick={toggleMute} className="mute-button">
    {isMuted ? '🔇' : '🔊'}
  </button>
</div>

      {/* Title */}
      <h1 className="title">
        <img src="/satlayer-logo.jpg" className="title-logo" alt="Satlayer Logo" />
        Satlayer Team Flip
      </h1>

      <h2 className="subtitle">How well can you recall the @satlayer team members? Let's play...</h2>

      {hasWon && (
        <>
          <div className="fireworks">🎉✨🎇🎆🥳🧠🎉</div>
          <div className="buttons">
            <a href={tweetLink} target="_blank" rel="noopener noreferrer">
              <button className="share-button">Share on Twitter</button>
            </a>
            <button className="play-again" onClick={handlePlayAgain}>Play Again</button>
          </div>
        </>
      )}

      {agents.length === 0 ? (
        <p>Loading agents...</p>
      ) : (
        <div className="grid">
          {agents.map((agent, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            return (
              <div
                key={index}
                className={`card ${isFlipped ? "flipped" : ""}`}
                onClick={() => handleFlip(index)}
              >
                <div className="inner">
                  <div className="front">
                    <img src="/satlayer-logo.jpg" alt="satlayer Logo" className="satlayer-logo" />
                  </div>
                  <div className="back">
                    <img src={agent.image} alt={agent.name} />
                    <div className="agent-name">{agent.name}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="footer">
        Made with <span className="heart">❤️</span> by{" "}
        <a
          href="https://twitter.com/everdonnew"
          target="_blank"
          rel="noopener noreferrer"
          className="highlight"
        >
          everdonnew <FaTwitter className="twitter-icon" />
        </a>{" "}
        for{" "}
        <a
          href="https://twitter.com/satlayer"
          target="_blank"
          rel="noopener noreferrer"
          className="highlight"
        >
          recallnet <FaTwitter className="twitter-icon" />
        </a>
      </p>
    </div>
  );
}
