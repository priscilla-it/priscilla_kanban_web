import Image from "next/image";

export default function NotFound() {
    const backgroundImage = "/images/backgrounds/notfound.jpg";

    return (
        <>
            <main className="relative flex min-h-screen flex-col items-center justify-center p-12">
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt="backgroundImage"
                        fill
                        priority
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <div className="relative z-10 bg-black bg-opacity-50 p-8 rounded-lg shadow-lg">
                    <h1 className="text-5xl text-purple-400 font-bold mb-4">
                        404 - Not Found
                    </h1>
                    <p className="text-xl text-white mb-6">
                        Sorry, the page you are looking for does not exist.
                    </p>
                    <a href="/" className="text-lg text-purple-400 hover:underline">
                        Go back to Home
                    </a>
                </div>
            </main>

            <footer className="flex justify-center p-4 bg-black">
                <a
                    href="mailto:priscilla.effects@gmail.com"
                    className="text-center text-white text-2xl hover:underline"
                    aria-label="Contact us via email"
                >
                    Contact us at priscilla.effects@gmail.com
                </a>
            </footer>
        </>
    );
}
