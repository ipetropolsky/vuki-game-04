import { useCallback, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

function App() {
    const [value, setValue] = useState('');
    const [hasError, setHasError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [shake, setShake] = useState(false);
    const [pageShake, setPageShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputWrapRef = useRef<HTMLDivElement>(null);

    const normalized = useMemo(() => value.trim().toLowerCase(), [value]);

    const fireCelebration = useCallback(() => {
        const durationMs = 2200;
        const end = Date.now() + durationMs;
        const scalar = 1.4;
        const defaults = { startVelocity: 35, spread: 70, ticks: 120, zIndex: 9999, scalar } as const;

        const interval = setInterval(() => {
            const wrap = inputWrapRef.current ?? inputRef.current;
            const rect = wrap?.getBoundingClientRect();
            const centerX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
            const centerY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.4;

            const timeLeft = end - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }
            const progress = 1 - timeLeft / durationMs;
            const baseCount = 120;
            const particleCount = Math.round(baseCount * (1 - progress * 0.2));

            const jitter = () => (Math.random() - 0.5) * 0.08; // ~±4% of screen
            const rand = (min: number, max: number) => Math.random() * (max - min) + min;

            // Left burst with random angle/spread and slight origin jitter
            confetti({
                ...defaults,
                particleCount,
                spread: rand(60, 85),
                angle: rand(30, 70),
                origin: { x: Math.max(0, centerX - 0.25 + jitter()), y: Math.max(0, centerY - 0.06 + jitter()) },
            });

            // Right burst with random angle/spread and slight origin jitter
            confetti({
                ...defaults,
                particleCount,
                spread: rand(60, 85),
                angle: rand(110, 150),
                origin: { x: Math.min(1, centerX + 0.25 + jitter()), y: Math.max(0, centerY - 0.06 + jitter()) },
            });

            setPageShake(true);
        }, 600);
    }, []);

    const handleSend = useCallback(() => {
        const correct = normalized === 'a gun';
        if (correct) {
            setIsSuccess(true);
            setHasError(false);
            setShake(false);
            // trigger page-level shake once per celebration
            setPageShake(false);
            fireCelebration();
        } else {
            setIsSuccess(false);
            setHasError(true);
            setShake(false);
            setPageShake(false);
            requestAnimationFrame(() => setShake(true));
            inputRef.current?.focus();
        }
    }, [normalized, fireCelebration]);

    return (
        <div
            className={[
                'min-h-screen w-full flex items-center justify-center p-4',
                pageShake ? 'animate-shake' : '',
            ].join(' ')}
            onAnimationEnd={(e) => {
                if (e.animationName.includes('shake')) {
                    setPageShake(false);
                }
            }}
        >
            <div className="w-full max-w-2xl">
                <h1 className="text-center text-4xl sm:text-5xl font-semibold mb-8">The Answer</h1>

                <div ref={inputWrapRef} className="flex gap-3 items-stretch">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            if (hasError) {
                                setHasError(false);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        placeholder="Your answer..."
                        className={[
                            'flex-1 rounded-lg bg-white/5 text-white placeholder-white/40',
                            'px-4 py-3 outline-none border transition-colors',
                            hasError ? 'border-red-500' : 'border-white/15 focus:border-white/40',
                            shake ? 'animate-shake' : '',
                        ].join(' ')}
                        onAnimationEnd={(e) => {
                            if (e.animationName.includes('shake')) {
                                setShake(false);
                            }
                        }}
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
                        <div className="reveal-down overflow-hidden rounded-lg shadow-xl">
                            <img src="/victory.jpg" alt="Victory" className="block max-h-[50svh]" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
