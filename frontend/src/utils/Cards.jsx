import React from "react"

const IntroCard = ({ cardRef, icon, title, description }) => (
  <div ref={cardRef} className="flex flex-col gap-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-[400px]">
    <div className="flex items-center gap-x-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-black/80"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <h2 className="font-semibold text-black/90 text-lg">{title}</h2>
    </div>
    <p className="text-sm text-black/80 text-left leading-relaxed">{description}</p>
  </div>
)

const CustomerCard = ({ tempRef, tempTitleRef, tempDetailRef, tempNameRef, tempPostRef, tempImg, tempTopic, tempName }) => (
  <div
    ref={tempRef}
    className="px-4 py-2 rounded-2xl absolute left-0 top-0 z-20 w-full h-[400px] gap-x-10 mx-auto shadow-lg bg-white flex items-center justify-center gap-y-4"
  >
    <div>
      <img className="rounded-2xl" src={tempImg} width={500} alt="" />
    </div>
    <div className="flex flex-col justify-center gap-y-6">
      <div ref={tempTitleRef || null}>
        <h1 className="font-semibold font-poppins text-lg text-black/80">{tempTopic}</h1>
      </div>
      <div ref={tempDetailRef || null}>
        <p className="max-w-[500px] font-mont">
          We use Freshservice for everything, and that just makes it really easy—regardless of what you need as an
          employee—to know that you can always just go to this tool and you're going to get whatever you need.
        </p>
      </div>
      <div className="flex flex-col gap-y-3">
        <div ref={tempNameRef || null} className="font-semibold text-lg text-black/80">
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
  <div ref={tileRef} className="flex items-center bg-white shadow-lg max-w-[90%] mx-auto gap-x-4 h-[250px] rounded-3xl">
    <div ref={subTileSectionRef} className="flex items-center justify-center w-[40%] opacity-0 gap-x-10">
      <div className="bg-black/80 rounded-full shadow-md text-white p-4 ml-7">
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
      <div className="flex flex-col justify-center w-full h-full gap-y-3 my-auto ml-4">
        <h2 className="text-black/80 text-lg font-semibold text-left">{tileName}</h2>
        <p className="text-left">{tileDetail}</p>
      </div>
    </div>
    <div
      ref={subTileLogoRef}
      className="gap-y-4 w-[45%] rounded-[30px] mx-auto bg-slate-50 h-full flex flex-col items-center justify-center"
    >
      <h4 className="font-mont">We are here</h4>
      <h1 className="text-2xl font-poppins font-medium">{tileQuote}</h1>
    </div>
  </div>
)

export { IntroCard, CustomerCard, SlidingCard }
