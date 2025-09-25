export function getUserDevicePreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  export function activateTheme(theme: any) {
    return [document.body.classList.remove('dark', 'light'), document.body.classList.add(theme)];
  }
  
  export function onUserDeviceThemeSwitch(fn: any) {
    window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
      return fn();
    });
  }
  