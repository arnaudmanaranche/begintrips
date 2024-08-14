import { Archivo_Black } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex h-screen bg-white">
      <div className="flex-grow relative">
        <Image
          className="rounded-r-[50px]"
          src="https://images.unsplash.com/photo-1500817487388-039e623edc21?q=80&w=2571&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="friends"
          fill
          objectFit="cover"
        />
        <div className="h-full w-full absolute top-0 left-0 rounded-r-[50px]" />
        <span className="absolute left-10 top-10 text-xl font-bold">
          Planner.so
        </span>
      </div>
      <div className="bg-white text-black items-center flex flex-col flex-1 my-20">
        <div className="flex flex-col items-center">
          <p
            className={`text-5xl font-medium uppercase ${archivoBlack.className} text-center`}
          >
            <span>
              Navigate
              <br />
              the world
            </span>
          </p>
        </div>
        <div>
          <Link
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            href="/onboarding"
          >
            Continue without an account
          </Link>
        </div>
      </div>
    </main>
  );
}
