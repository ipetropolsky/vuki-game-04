import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

function App() {
    const [value, setValue] = useState('');
    const [hasError, setHasError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const normalized = useMemo(() => value.trim().toLowerCase(), [value]);

    const fireCelebration = useCallback(() => {
        const durationMs = 900;
        const end = Date.now() + durationMs;
        const defaults = { startVelocity: 32, spread: 360, ticks: 60, zIndex: 9999 };
        const interval = setInterval(() => {
            const timeLeft = end - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }
            const particleCount = Math.round(80 * (timeLeft / durationMs));
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
        }, 120);
    }, []);

    const handleSend = useCallback(() => {
        const correct = normalized === 'a gun';
        if (correct) {
            setIsSuccess(true);
            setHasError(false);
            fireCelebration();
        } else {
            setIsSuccess(false);
            setHasError(true);
            // re-focus to emphasize correction flow
            inputRef.current?.focus();
        }
    }, [normalized, fireCelebration]);

    useEffect(() => {
        if (value.length > 0 && hasError) {
            setHasError(false);
        }
    }, [value, hasError]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <h1 className="text-center text-4xl sm:text-5xl font-semibold mb-8">The Question</h1>

                <div className="flex gap-3 items-stretch">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        placeholder="Your answer..."
                        className={[
                            'flex-1 rounded-lg bg-white/5 text-white placeholder-white/40',
                            'px-4 py-3 outline-none border transition-colors',
                            hasError ? 'border-red-500 animate-shake' : 'border-white/15 focus:border-white/40',
                        ].join(' ')}
                        aria-invalid={hasError}
                    />
                    <button
                        type="button"
                        onClick={handleSend}
                        className="shrink-0 rounded-lg bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 px-6 text-lg font-medium"
                    >
                        Send
                    </button>
                </div>

                {isSuccess && (
                    <div className="mt-8 flex justify-center">
                        <img
                            src="/victory.jpg"
                            alt="Victory"
                            className="max-h-[50svh] rounded-lg shadow-xl animate-pop-in"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
