export default {
    '!src/**/*.{ts,tsx}': (files) => `npm run format ${files.join(' ')}`,
    'src/**/*.{ts,tsx}': (files) => [
        'npm run ts-check',
        `npm run lint ${files.join(' ')}`,
        `npm run format ${files.join(' ')}`,
    ],
};
