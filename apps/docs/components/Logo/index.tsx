import LogoIcon from "./LogoIcon";

export default function Logo() {
  return (
    <div className="flex items-center space-x-[10px] group">
      <LogoIcon className="" width={24} height={24} />
      <span className={`text-[18px] font-semibold tracking-wide mb-[2px]`}>
        <span className="">next</span>
        <span className="">2</span>
        <span className="">app</span>
      </span>
    </div>
  );
}
