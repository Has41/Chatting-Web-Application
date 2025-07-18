const IntroCard = ({ cardRef, icon, title, description }) => (
  <div ref={cardRef} className="flex w-full max-w-[400px] flex-col gap-y-4 rounded-lg bg-white p-6 shadow-md">
    <div className="flex items-center gap-x-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 text-black/80"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <h2 className="text-lg font-semibold text-black/90">{title}</h2>
    </div>
    <p className="text-left text-sm leading-relaxed text-black/80">{description}</p>
  </div>
)

const CustomerCard = ({ tempRef, tempTitleRef, tempDetailRef, tempNameRef, tempPostRef, tempImg, tempTopic, tempName }) => (
  <div
    ref={tempRef}
    className="absolute left-0 top-0 z-20 mx-auto flex h-[400px] w-full items-center justify-center gap-x-10 gap-y-4 rounded-2xl bg-white px-4 py-2 shadow-lg"
  >
    <div>
      <img className="rounded-2xl" src={tempImg} width={500} alt="" />
    </div>
    <div className="flex flex-col justify-center gap-y-6">
      <div ref={tempTitleRef || null}>
        <h1 className="font-poppins text-lg font-semibold text-black/80">{tempTopic}</h1>
      </div>
      <div ref={tempDetailRef || null}>
        <p className="max-w-[500px] font-mont">
          We use Freshservice for everything, and that just makes it really easy—regardless of what you need as an
          employee—to know that you can always just go to this tool and you're going to get whatever you need.
        </p>
      </div>
      <div className="flex flex-col gap-y-3">
        <div ref={tempNameRef || null} className="text-lg font-semibold text-black/80">
          {tempName}
        </div>
        <div ref={tempPostRef || null} className="font-mont">
          System Administrator, Allbirds
        </div>
      </div>
    </div>
  </div>
)

const SlidingCard = ({ tileRef, subTileSectionRef, subTileLogoRef, iconPath, tileName, tileDetail, tileQuote }) => (
  <div ref={tileRef} className="mx-auto flex h-[250px] max-w-[90%] items-center gap-x-4 rounded-3xl bg-white shadow-lg">
    <div ref={subTileSectionRef} className="flex w-[40%] items-center justify-center gap-x-10 opacity-0">
      <div className="ml-7 rounded-full bg-black/80 p-4 text-white shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <div className="my-auto ml-4 flex h-full w-full flex-col justify-center gap-y-3">
        <h2 className="text-left text-lg font-semibold text-black/80">{tileName}</h2>
        <p className="text-left">{tileDetail}</p>
      </div>
    </div>
    <div
      ref={subTileLogoRef}
      className="mx-auto flex h-full w-[45%] flex-col items-center justify-center gap-y-4 rounded-[30px] bg-slate-50"
    >
      <h4 className="font-mont">We are here</h4>
      <h1 className="font-poppins text-2xl font-medium">{tileQuote}</h1>
    </div>
  </div>
)

export { IntroCard, CustomerCard, SlidingCard }
