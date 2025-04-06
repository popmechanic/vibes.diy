const LightUpYourData = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src="/code-things-black.png"
        alt="You can just code things"
        className="logo-pulse opacity-3 dark:hidden"
      />
      <img
        src="/code-things.png"
        alt="You can just code things"
        className="logo-pulse hidden opacity-3 dark:block"
      />
    </div>
  );
};

export default LightUpYourData;
