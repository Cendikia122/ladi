"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(pathname);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setAnimKey(pathname);
  }, [pathname]);

  return (
    <div key={animKey} className={isFirstMount.current ? "" : "animate-page-enter"}>
      {children}
    </div>
  );
}
