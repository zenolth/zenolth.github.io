import packageJson from '../../package.json';
import themes from '../../themes.json';
import { history } from '../stores/history';
import { theme } from '../stores/theme';

const hostname = window.location.hostname;

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => 'Available commands: ' + Object.keys(commands).join(', '),
  hostname: () => hostname,
  whoami: () => 'guest',
  date: () => new Date().toLocaleString(),
  vi: () => `why use vi? try 'emacs'`,
  vim: () => `why use vim? try 'emacs'`,
  emacs: () => `why use emacs? try 'vim'`,
  echo: (args: string[]) => args.join(' '),
  sudo: (args: string[]) => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    return `Permission denied: unable to run the command '${args[0]}' as root.`;
  },
  theme: (args: string[]) => {
    const usage = `Usage: theme [args].
    [args]:
      ls: list all available themes
      set: set theme to [theme]

    [Examples]:
      theme ls
      theme set gruvboxdark
    `;
    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case 'ls': {
        let result = themes.map((t) => t.name.toLowerCase()).join(', ');
        result += `You can preview all these themes here: ${packageJson.repository.url}/tree/master/docs/themes`;

        return result;
      }

      case 'set': {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme);

        if (!t) {
          return `Theme '${selectedTheme}' not found. Try 'theme ls' to see all available themes.`;
        }

        theme.set(t);

        return `Theme set to ${selectedTheme}`;
      }

      default: {
        return usage;
      }
    }
  },
  repo: () => {
    window.open(packageJson.repository.url, '_blank');

    return 'Opening repository...';
  },
  clear: () => {
    history.set([]);

    return '';
  },
  email: () => {
    window.open(`mailto:${packageJson.author.email}`);

    return `Opening mailto:${packageJson.author.email}...`;
  },
  donate: () => {
    window.open(packageJson.funding.url, '_blank');

    return 'Opening donation url...';
  },
  weather: async (args: string[]) => {
    const city = args.join('+');

    if (!city) {
      return 'Usage: weather [city]. Example: weather Brussels';
    }

    const weather = await fetch(`https://wttr.in/${city}?ATm`);

    return weather.text();
  },
  quote: async () => {
    const quote = await fetch("https://quotes-api-self.vercel.app/quote");

    if (!quote.ok) return `Failed to fetch : ${quote.status} ${quote.text()}`;

    const quoteJson = await quote.json();

    return `"${quoteJson.quote} -${quoteJson.author}"`;
  },
  joke: async () => {

    const joke = await fetch("https://official-joke-api.appspot.com/jokes/random");

    if (!joke.ok) return `Failed to fetch : ${joke.status} ${joke.text()}`;

    const jokeJson = await joke.json();

    return `${jokeJson.setup} ${jokeJson.punchline}`;
  },
  exit: () => {
    return 'Please close the tab to exit.';
  },
  curl: async (args: string[]) => {
    if (args.length === 0) {
      return 'curl: no URL provided';
    }

    const url = args[0];

    try {
      const response = await fetch(url);
      const data = await response.text();

      return data;
    } catch (error) {
      return `curl: could not fetch URL ${url}. Details: ${error}`;
    }
  },
  projects: () => `-= Man From The Fog: Reimagined =-
Experience The Man with a fresh coat of paint and a lot harder to beat AI
<a class="underline" href="https://modrinth.com/mod/man-from-the-fog-reimagined">https://modrinth.com/mod/man-from-the-fog-reimagined</a>`,
  discord: () => {
    window.open("https://discord.gg/pB2tSCkYrU")

    return "Enjoy your stay!"
  },
  banner: () => `
███████╗███████╗███╗   ██╗
╚══███╔╝██╔════╝████╗  ██║
  ███╔╝ █████╗  ██╔██╗ ██║
 ███╔╝  ██╔══╝  ██║╚██╗██║
███████╗███████╗██║ ╚████║
╚══════╝╚══════╝╚═╝  ╚═══╝ v${packageJson.version}

Type 'help' to see list of available commands.
`,
};
