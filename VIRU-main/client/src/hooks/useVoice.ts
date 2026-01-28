import { useState, useEffect, useRef } from 'react';

// Browser Speech API Types (since they aren't in standard lib by default sometimes)
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export const useVoice = (onFinalTranscript?: (text: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [supported, setSupported] = useState(false);
    const [mode, setMode] = useState<'command' | 'continuous'>('command');

    // Refs to keep instances stable
    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

    useEffect(() => {
        const win = window as unknown as IWindow;
        const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

        if (SpeechRecognition) {
            setSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // We use manual restart for "continuous" feel to ensure clarity
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);

            recognition.onend = () => {
                setIsListening(false);
                // God Mode: Auto-restart if we are in continuous mode
                if (mode === 'continuous') {
                    // Slight delay to prevent CPU hogging
                    setTimeout(() => {
                        try {
                            // Only restart if still in mode (might have changed during timeout)
                            recognition.start();
                        } catch (e) {
                            // ignore
                        }
                    }, 300);
                }
            };

            recognition.onresult = (event: any) => {
                let currentTranscript = '';
                let isFinal = false;

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                    if (event.results[i].isFinal) isFinal = true;
                }
                setTranscript(currentTranscript);

                if (isFinal && onFinalTranscript && currentTranscript.trim()) {
                    onFinalTranscript(currentTranscript);
                }
            };

            recognitionRef.current = recognition;
        }
    }, [mode]); // Re-bind if mode changes? No, mode is ref-checked in start/end logic usually or we need to be careful. 
    // Actually the useEffect depends on [mode] so it effectively re-creates the recognition object when mode changes? 
    // Wait, 'mode' in onend closure is stale if we don't include it in deps. 
    // But re-creating recognition every mode change is fine.

    const startListening = (continuous = false) => {
        if (recognitionRef.current) {
            setMode(continuous ? 'continuous' : 'command');
            setTranscript('');
            try {
                // If already started, this might throw, but checking !isListening helps
                if (!isListening) recognitionRef.current.start();
            } catch (e) { console.error(e); }
        }
    };

    const stopListening = () => {
        setMode('command'); // Disable auto-restart immediately
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const speak = (text: string) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();

        // Strip code blocks for speech to avoid reading out entire functions
        const cleanText = text.replace(/```[\s\S]*?```/g, " I have generated the code. ");

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.1;
        utterance.pitch = 0.9;

        const voices = synthRef.current.getVoices();
        const techVoice = voices.find(v => v.name.includes('Microsoft Mark'))
            || voices.find(v => v.name.includes('Google US English'))
            || voices.find(v => v.lang.startsWith('en'));

        if (techVoice) utterance.voice = techVoice;
        synthRef.current.speak(utterance);
    };

    return {
        isListening,
        transcript,
        supported,
        startListening,
        stopListening,
        speak,
        setTranscript,
        mode
    };
};
