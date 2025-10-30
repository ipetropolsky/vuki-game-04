import { useCallback, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import victoryUrl from '../assets/victory.jpg';
import treasureUrl from '../assets/treasure.jpg';

function App() {
    const [value, setValue] = useState('');
    const [hasError, setHasError] = useState(false);
    const [shake, setShake] = useState(false);
    const [pageShake, setPageShake] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputWrapRef = useRef<HTMLDivElement>(null);
    const victoryWrapRef = useRef<HTMLDivElement>(null);
    const victoryImgRef = useRef<HTMLImageElement>(null);
    const [victoryHeightPx, setVictoryHeightPx] = useState<number | 'auto'>(0);

    const claimRef = useRef<HTMLButtonElement>(null);
    const treasureWrapRef = useRef<HTMLDivElement>(null);
    const treasureImgRef = useRef<HTMLImageElement>(null);
    const [treasureHeightPx, setTreasureHeightPx] = useState<number | 'auto'>(0);

    const [claimHeightPx, setClaimHeightPx] = useState<number | 'auto'>(0);

    const normalized = useMemo(() => value.trim().toLowerCase(), [value]);

    const onVictoryLoad = useCallback(() => {
        const wrap = victoryWrapRef.current;
        const img = victoryImgRef.current;
        if (!wrap || !img) {
            return;
        }
        const wrapWidth = wrap.clientWidth || img.clientWidth;
        const target = (img.naturalHeight / img.naturalWidth) * wrapWidth;
        requestAnimationFrame(() => setVictoryHeightPx(target));
    }, []);

    const onTreasureLoad = useCallback(() => {
        const wrap = treasureWrapRef.current;
        const img = treasureImgRef.current;
        if (!wrap || !img) {
            return;
        }
        const wrapWidth = wrap.clientWidth || img.clientWidth;
        const target = (img.naturalHeight / img.naturalWidth) * wrapWidth;
        requestAnimationFrame(() => setTreasureHeightPx(target));
    }, []);

    const onClaimLoad = useCallback(() => {
        if (!claimRef.current) {
            return;
        }
        // measure once when becomes available
        const rect = claimRef.current.getBoundingClientRect();
        const computed = rect.height;
        if (computed) {
            requestAnimationFrame(() => setClaimHeightPx(computed));
        }
    }, []);

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

        setTimeout(() => {
            onClaimLoad();
        }, durationMs + 1000);
    }, [onClaimLoad]);

    const handleSend = useCallback(() => {
        const correct = normalized === 'a gun';
        if (correct) {
            setHasError(false);
            setShake(false);
            setPageShake(false);
            setVictoryHeightPx(0);
            setTreasureHeightPx(0);
            setClaimHeightPx(0);
            fireCelebration();
            onVictoryLoad();
        } else {
            setHasError(true);
            setShake(false);
            setPageShake(false);
            setVictoryHeightPx(0);
            setVictoryHeightPx(0);
            setTreasureHeightPx(0);
            setClaimHeightPx(0);
            requestAnimationFrame(() => setShake(true));
            inputRef.current?.focus();
        }
    }, [normalized, fireCelebration, onVictoryLoad]);

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

                <div ref={inputWrapRef} className="flex flex-col sm:flex-row gap-3 items-stretch">
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
                            'flex-1 rounded-lg bg-white/5 text-white text-xl sm:text-2xl placeholder-white/40',
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
                        className="shrink-0 rounded-lg bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 px-6 py-3 text-xl sm:text-2xl font-medium"
                    >
                        Send
                    </button>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6">
                    <div
                        ref={victoryWrapRef}
                        className="reveal-height overflow-hidden rounded-lg shadow-xl w-full"
                        style={{ height: victoryHeightPx === 'auto' ? 'auto' : `${victoryHeightPx}px` }}
                        onTransitionEnd={() => {
                            if (victoryHeightPx !== 'auto') {
                                setVictoryHeightPx('auto');
                            }
                        }}
                    >
                        <img ref={victoryImgRef} src={victoryUrl} alt="Victory" className="block w-full h-auto" />
                    </div>

                    <div
                        className="reveal-height w-full flex justify-center"
                        style={{ height: claimHeightPx === 'auto' ? 'auto' : `${claimHeightPx}px` }}
                        onTransitionEnd={() => {
                            if (claimHeightPx !== 'auto') {
                                setClaimHeightPx('auto');
                            }
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                if (treasureHeightPx !== 'auto') {
                                    setTreasureHeightPx(0);
                                    requestAnimationFrame(() => onTreasureLoad());
                                }
                            }}
                            className="min-h-15 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white text-xl sm:text-2xl font-semibold px-8 py-4 shadow-lg transition-colors"
                            ref={claimRef}
                        >
                            🏆 Claim the Award
                        </button>
                    </div>

                    <div
                        ref={treasureWrapRef}
                        className="reveal-height overflow-hidden rounded-lg shadow-xl w-full"
                        style={{ height: treasureHeightPx === 'auto' ? 'auto' : `${treasureHeightPx}px` }}
                        onTransitionEnd={() => {
                            if (treasureHeightPx !== 'auto') {
                                setTreasureHeightPx('auto');
                            }
                        }}
                    >
                        <img ref={treasureImgRef} src={treasureUrl} alt="Treasure" className="block w-full h-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
