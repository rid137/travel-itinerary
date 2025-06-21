export const RingSpinner = () => (
  <div className="relative">
    <div className="relative flex aspect-square w-32 animate-[spin_2s_linear_infinite] items-center justify-center rounded-[50%] bg-[conic-gradient(transparent,#0D6EFD)] p-4 before:absolute before:size-4/5 before:rounded-[50%] before:bg-white before:content-['_']" />
    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[13px] font-semibold"></span>
  </div>
);