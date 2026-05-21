import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Music, Volume2, VolumeX, Minimize2, Check } from 'lucide-react';
import { Song } from '../utils/db';

interface MusicPlayerProps {
  songs: Song[];
}

export default function MusicPlayer({ songs }: MusicPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeSong = songs[currentIndex] || songs[0];

  // Initialize or update audio source when active song changes
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    if (activeSong?.url) {
      const wasPlaying = isPlaying;
      audioRef.current.src = activeSong.url;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch((err) => {
          console.log('Autoplay blocked or audio failed:', err);
          setIsPlaying(false);
        });
      }
    }
    
    // Reset times
    setCurrentTime(0);
    setDuration(0);
  }, [currentIndex, activeSong?.url]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback failed:', err);
          alert('Não foi possível reproduzir a música. Verifique o link ou se o arquivo é válido no painel.');
        });
    }
  };

  // Handle Next song
  const handleNext = () => {
    if (songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, songs]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (songs.length === 0) return null;

  return (
    <>
      {/* Floating Trigger Button (Left Side) */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 bg-[#111111] hover:bg-[#1f1f1f] text-[#f3f4f6] rounded-full border border-white/10 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none relative ${
            isPlaying ? 'border-[#f3f4f6]' : ''
          }`}
          aria-label="Abrir reprodutor de música"
        >
          {isPlaying ? (
            /* Visualizer Animation */
            <div className="flex gap-0.5 items-end justify-center h-4 w-5">
              <span className="w-0.75 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }} />
              <span className="w-0.75 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.9s' }} />
              <span className="w-0.75 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.0s', animationDuration: '0.7s' }} />
              <span className="w-0.75 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '0.8s' }} />
            </div>
          ) : (
            <Music className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          )}

          {/* Pulse effect */}
          {isPlaying && (
            <span className="absolute inset-0 rounded-full border border-white/30 animate-ping"></span>
          )}
        </button>
      </div>

      {/* Music Player Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-6 z-50 w-80 glass-panel text-[#f3f4f6] rounded-xl shadow-2xl overflow-hidden border border-white/10 p-5 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-white animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-semibold font-serif-luxury">
                RV SOUNDSPACE
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#a3a3a3] hover:text-[#f3f4f6] transition-colors"
              aria-label="Minimizar"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Song Info */}
          <div className="mb-4">
            <h4 className="font-serif-luxury text-sm font-semibold truncate text-[#f3f4f6]">
              {activeSong?.title || 'Sem título'}
            </h4>
            <p className="text-xs text-[#a3a3a3] truncate mt-0.5">
              {activeSong?.artist || 'Autor desconhecido'}
            </p>
          </div>

          {/* Audio Slider Progress */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="flex justify-between text-[10px] text-[#a3a3a3] mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-[#a3a3a3] hover:text-[#f3f4f6] transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 h-1 bg-[#222222] rounded-lg appearance-none cursor-pointer accent-white opacity-0 group-hover/volume:opacity-100 transition-opacity"
              />
            </div>

            {/* Play/Pause & Skip */}
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-neutral-200 text-black rounded-full transition-all duration-200 focus:outline-none shadow-md hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-[#a3a3a3] hover:text-[#f3f4f6] transition-colors hover:scale-105 active:scale-95"
                title="Próxima faixa"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden Spacer */}
            <div className="w-10" />
          </div>

          {/* Playlist */}
          <div className="border-t border-white/5 pt-3">
            <span className="text-[10px] text-[#a3a3a3] uppercase tracking-widest font-semibold block mb-2">
              Playlist
            </span>
            <div className="space-y-1.5">
              {songs.map((song, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={song.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsPlaying(true);
                    }}
                    className={`w-full flex items-center justify-between text-left text-xs p-1.5 rounded transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white font-medium'
                        : 'hover:bg-white/5 text-[#a3a3a3] hover:text-[#f3f4f6]'
                    }`}
                  >
                    <span className="truncate pr-2">
                      {index + 1}. {song.title}
                    </span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
