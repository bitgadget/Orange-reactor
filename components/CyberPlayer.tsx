import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, Radio } from 'lucide-react';
import { Theme } from '../types';

interface Track {
  title: string;
  artist: string;
  url: string;
}

// 🎵 PLAYLIST CONFIGURATION 🎵
// Using high-availability CDN links to ensure playback works in all environments.
const PLAYLIST: Track[] = [
  {
    title: "NEON_HIGHWAY",
    artist: "EPOQ",
    url: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg"
  },
  {
    title: "RETRO_SYNTH",
    artist: "GALAXY_INVADERS",
    url: "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
  },
  {
    title: "DATA_FLOW",
    artist: "PYMAN_OST",
    url: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg"
  },
  {
    title: "SYSTEM_PULSE",
    artist: "PAZA",
    url: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3"
  }
];

interface Props {
  theme?: Theme;
}

const CyberPlayer: React.FC<Props> = ({ theme = 'CYBER' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isCyber = theme === 'CYBER';

  // Attempt auto-play on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4; // Set moderate start volume

    // Browser policy usually blocks this, so we handle it gracefully
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setInitialized(true);
        })
        .catch((error) => {
          // Auto-play was prevented. This is normal.
          // We set state to waiting for user interaction.
          // console.log("Autoplay prevented by browser policy (waiting for user input).");
          setIsPlaying(false);
          setInitialized(false);
        });
    }
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // First interaction initializes the audio context if needed
    if (!initialized) {
        setInitialized(true);
        audio.play()
            .then(() => setIsPlaying(true))
            .catch((e) => {
                console.warn("Manual playback init failed:", e.message);
                setIsPlaying(false);
            });
        return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.warn("Play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  // Switch track logic
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !initialized) return;

    // Save current playing state
    const wasPlaying = isPlaying;
    
    // Changing src automatically stops playback, so we don't need to pause manually
    // audio.src is updated via the render prop below, but we trigger load here
    // However, since we pass src directly to <audio>, React handles the DOM update.
    // We just need to handle the playback resume.
    
    // Small timeout to allow React to update the DOM src attribute
    setTimeout(() => {
        if (wasPlaying) {
            audio.play().catch(() => {
                // If play fails during track switch, just reset state
                setIsPlaying(false);
            });
        }
    }, 50);
    
  }, [currentTrackIndex]); 

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audio.muted = newMuted;
  };

  return (
    <div className={`flex items-center gap-4 px-3 py-2 border h-10 transition-all duration-300 relative overflow-hidden group select-none
        ${isCyber 
            ? 'border-cyber-orangeDim bg-cyber-dark/80 hover:border-cyber-orange hover:shadow-[0_0_15px_rgba(255,102,0,0.2)]' 
            : 'border-zinc-300 bg-zinc-100'}
    `}>
      <audio 
        ref={audioRef} 
        src={PLAYLIST[currentTrackIndex].url} 
        onEnded={handleNext}
        onError={() => {
            // Silently skip to next track on error without crashing or spamming logs
            console.warn("Audio source unreachable, skipping track.");
            handleNext(); 
        }}
        loop={false}
      />

      {/* Visualizer (CSS Animation) */}
      <div 
        onClick={handlePlayPause}
        className="flex items-end gap-0.5 h-4 w-8 cursor-pointer"
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className={`w-1 rounded-t-sm transition-all duration-75 
                ${isCyber ? 'bg-cyber-orange' : 'bg-zinc-800'} 
                ${isPlaying ? 'animate-equalizer' : 'h-1 opacity-50'}`}
            style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.4 + Math.random() * 0.4}s` 
            }}
          />
        ))}
      </div>

      {/* Track Info */}
      <div className="flex flex-col w-28 md:w-36 overflow-hidden">
        <div className={`text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1
             ${isCyber ? 'text-white' : 'text-zinc-900'}`}>
            {!initialized && isCyber && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/>}
            {initialized ? PLAYLIST[currentTrackIndex].title : "SYSTEM_AUDIO"}
        </div>
        <div className={`text-[8px] tracking-wider uppercase
             ${isCyber ? 'text-cyber-orangeDim' : 'text-zinc-500'}`}>
            {initialized ? PLAYLIST[currentTrackIndex].artist : "CLICK TO INITIALIZE"}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button 
            onClick={handlePlayPause}
            className={`p-1 rounded transition-colors ${isCyber ? 'hover:bg-cyber-orange/20 text-cyber-orange' : 'hover:bg-zinc-200 text-zinc-700'}`}
        >
            {!initialized ? <Radio size={14} className="animate-pulse" /> : isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        
        <button 
            onClick={handleNext}
             className={`p-1 rounded transition-colors ${isCyber ? 'hover:bg-cyber-orange/20 text-cyber-orange' : 'hover:bg-zinc-200 text-zinc-700'}`}
        >
            <SkipForward size={14} />
        </button>

        <button 
            onClick={toggleMute}
            className={`p-1 rounded transition-colors hidden md:block ${isCyber ? 'hover:bg-cyber-orange/20 text-cyber-orangeDim' : 'hover:bg-zinc-200 text-zinc-500'}`}
        >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Progress Bar (Decorative) */}
      {isPlaying && (
          <div className={`absolute bottom-0 left-0 h-[2px] bg-cyber-orange opacity-50 animate-[width_180s_linear_infinite]`} style={{ width: '0%' }} />
      )}
    </div>
  );
};

export default CyberPlayer;