import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans flex flex-col items-center justify-center min-h-screen p-8`}
    >
      <main className="flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          通達・マニュアル検索
        </h1>
        <p className="text-lg text-muted-foreground">
          キーワードを入力してマニュアルを検索してください。
        </p>
        <div className="flex w-full max-w-md items-center space-x-2">
          <input
            type="text"
            placeholder="例: メニュー改定通達"
            className="rounded-md border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex-grow w-full h-12 px-5"
          />
          <button
            type="submit"
            className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 px-5"
          >
            検索
          </button>
        </div>
      </main>
    </div>
  );
}