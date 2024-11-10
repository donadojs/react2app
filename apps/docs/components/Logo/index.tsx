import LogoIcon from "./LogoIcon";

export default function React2AppLogo() {
  return (
    <div className="flex items-center space-x-[10px] group">
      <LogoIcon className="mt-[2px]" width={24} height={24} />
      <span className={`text-[18px] font-semibold tracking-wide `}>
        <span className="">react</span>
        <span className="">2</span>
        <span className="">app</span>
      </span>
    </div>
  );
}
