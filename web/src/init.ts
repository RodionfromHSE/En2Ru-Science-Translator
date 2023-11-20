// Hack. See https://stackoverflow.com/questions/72114775/vite-global-is-not-defined

// @ts-ignore
window.global ||= window;
