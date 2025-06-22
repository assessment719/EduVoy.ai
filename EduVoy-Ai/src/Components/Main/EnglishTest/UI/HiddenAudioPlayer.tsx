import { useRef, useEffect, useState } from 'react';

interface HiddenAudioPlayerProps {
    isGenerateAudio: boolean;
    audioBuffer?: ArrayBuffer | string | null; // Updated to accept both ArrayBuffer and base64 string
    isPlaying?: boolean;
    shouldReplay?: number;
    onEnded?: () => void;
    onTimeUpdate?: () => void;
    onLoadedMetadata?: (duration: number) => void;
    onDurationChange?: (duration: number) => void;
}

export default function HiddenAudioPlayer({
    isGenerateAudio,
    audioBuffer,
    isPlaying = false,
    shouldReplay = 0,
    onEnded,
    onTimeUpdate,
    onLoadedMetadata,
    onDurationChange
}: HiddenAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const initialAudioRef = useRef<HTMLAudioElement | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // Helper function to convert base64 to URL
    const base64ToUrl = (base64: string, sliceSize: number = 512): string => {
        const byteCharacters = atob(base64);
        const byteArrays: Uint8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const audioBlob = new Blob(byteArrays, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        return url;
    };

    // Convert AudioBuffer or base64 string to blob URL
    useEffect(() => {
        if (isGenerateAudio && audioBuffer) {
            try {
                let url: string;

                if (typeof audioBuffer === 'string') {
                    // Handle base64 string
                    url = base64ToUrl(audioBuffer);
                    console.log('Created audio URL from base64 string:', url);
                } else {
                    // Handle ArrayBuffer (existing logic)
                    const blob = new Blob([audioBuffer], { type: 'audio/wav' });
                    url = URL.createObjectURL(blob);
                    console.log('Created audio URL from ArrayBuffer:', url);
                }

                // Clean up previous URL
                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                }

                setAudioUrl(url);

                // Cleanup function
                return () => {
                    URL.revokeObjectURL(url);
                };
            } catch (error) {
                console.error('Failed to create audio URL from buffer:', error);
            }
        } else if (!isGenerateAudio) {
            // Clean up audio URL when not using generated audio
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
            }
        }
    }, [audioBuffer, isGenerateAudio]);

    // Handle metadata loaded and duration change
    const handleLoadedMetadata = (): void => {
        if (audioRef.current) {
            const audioDuration = audioRef.current.duration;
            onLoadedMetadata?.(audioDuration);
            onDurationChange?.(audioDuration);
            console.log('Generated audio duration:', audioDuration);
        }
    };

    // Initialize initial audio
    const initializeInitialAudio = async () => {
        if (!initialAudioRef.current) {
            try {
                const sound = await import('./../Assets/Switzerland.wav');
                initialAudioRef.current = new Audio(sound.default);

                // Add event listeners for initial audio
                initialAudioRef.current.addEventListener('ended', () => {
                    onEnded?.();
                });

                initialAudioRef.current.addEventListener('timeupdate', () => {
                    onTimeUpdate?.();
                });

                initialAudioRef.current.addEventListener('loadedmetadata', () => {
                    if (initialAudioRef.current) {
                        const duration = initialAudioRef.current.duration;
                        onLoadedMetadata?.(duration);
                        onDurationChange?.(duration);
                        console.log('Initial audio duration:', duration);
                    }
                });
            } catch (error) {
                console.error('Failed to load initial audio:', error);
            }
        }
    };

    // Play initial audio
    const playInitialAudio = async () => {
        await initializeInitialAudio();
        if (initialAudioRef.current) {
            try {
                await initialAudioRef.current.play();
            } catch (error) {
                console.error('Failed to play initial audio:', error);
            }
        }
    };

    // Pause initial audio
    const pauseInitialAudio = () => {
        if (initialAudioRef.current) {
            initialAudioRef.current.pause();
        }
    };

    // Replay initial audio
    const replayInitialAudio = async () => {
        await initializeInitialAudio();
        if (initialAudioRef.current) {
            initialAudioRef.current.currentTime = 0;
            try {
                await initialAudioRef.current.play();
            } catch (error) {
                console.error('Failed to replay initial audio:', error);
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (initialAudioRef.current) {
                initialAudioRef.current.pause();
                initialAudioRef.current.currentTime = 0;
                initialAudioRef.current = null;
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    // Handle play/pause for both audio types
    useEffect(() => {
        console.log('isGenerateAudio:', isGenerateAudio, 'isPlaying:', isPlaying, 'audioUrl:', audioUrl);

        if (isGenerateAudio && audioUrl && audioRef.current) {
            // Handle generated audio
            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            } else {
                audioRef.current.pause();
            }
        } else if (!isGenerateAudio) {
            // Handle initial audio
            if (isPlaying) {
                playInitialAudio();
            } else {
                pauseInitialAudio();
            }
        }
    }, [isPlaying, isGenerateAudio, audioUrl]);

    // Handle replay for both audio types
    useEffect(() => {
        if (shouldReplay === 0) return;

        const replay = async () => {
            if (isGenerateAudio && audioUrl && audioRef.current) {
                audioRef.current.currentTime = 0;
                try {
                    await audioRef.current.play();
                    console.log("Replaying generated audio");
                } catch (error) {
                    console.error('Failed to replay generated audio:', error);
                }
            } else if (!isGenerateAudio) {
                await replayInitialAudio();
                console.log("Replaying initial audio");
            }
        };

        replay();
    }, [shouldReplay, isGenerateAudio, audioUrl]);

    // Load generated audio when URL changes
    useEffect(() => {
        if (isGenerateAudio && audioUrl && audioRef.current) {
            // Force reload the audio element when URL changes
            audioRef.current.load();
            console.log('Loading new audio URL:', audioUrl);
        }
    }, [audioUrl, isGenerateAudio]);

    return (
        <>
            {/* Render audio element when we have generated audio */}
            {isGenerateAudio && audioUrl && (
                <audio
                    ref={audioRef}
                    onEnded={onEnded}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onError={(e) => console.error('Audio error:', e)}
                    preload="metadata"
                    style={{ display: 'none' }}
                >
                    <source src={audioUrl} type="audio/wav" />
                </audio>
            )}
        </>
    );
}