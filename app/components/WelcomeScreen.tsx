// Welcome screen component shown when no messages are present
import VibesDIYLogo from './VibesDIYLogo';

const WelcomeScreen = () => {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center space-y-6 px-12 text-center">
      {/* Logo with adjusted colors */}
      <VibesDIYLogo className="scale-[3] font-bold text-light-secondary/80 sm:scale-[5] dark:text-dark-secondary/80" />

      {/* Tagline */}
      <p className="pt-16 text-lg italic text-light-secondary dark:text-dark-secondary">
        Generate apps in seconds.
      </p>

      {/* Links */}
      <p className="mt-8 text-xs italic text-light-secondary/70 dark:text-dark-secondary/70">
        Share your apps with the{' '}
        <a
          href="https://discord.gg/DbSXGqvxFc"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-00-light hover:underline dark:text-accent-00-dark"
        >
          Discord community
        </a>{' '}
        and fork the{' '}
        <a
          href="https://github.com/fireproof-storage/vibes.diy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-00-light hover:underline dark:text-accent-00-dark"
        >
          builder repo
        </a>
        .
      </p>
    </div>
  );
};

export default WelcomeScreen;