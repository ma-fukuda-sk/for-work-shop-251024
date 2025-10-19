import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { GetServerSideProps } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const emailHeader = context.req.headers["x-goog-authenticated-user-email"];
  const email = Array.isArray(emailHeader) ? emailHeader[0] : emailHeader;
  let username = "ゲスト";

  if (email) {
    const emailString = email.startsWith("google:") ? email.substring(7) : email;
    username = emailString.split("@")[0];
  }

  return {
    props: {
      username,
    },
  };
};

export default function Home({ username }: { username: string }) {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans flex flex-col items-center min-h-screen`}
    >
      <header className="w-full p-4 border-b border-solid border-black/[.08] dark:border-white/[.145]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h2 className="text-lg font-semibold">検索システム</h2>
          <p>{username} さん</p>
        </div>
      </header>
      <main className="flex flex-col gap-8 items-center text-center p-8 flex-grow justify-center">
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
