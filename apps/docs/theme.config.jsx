import Logo from "./components/Logo";

export default {
  head: (
    <>
      <title>next2app</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="next2app" />
      <meta property="og:description" content="Next.js to App in 3 commands" />
      <link
        rel="icon"
        type="image/png"
        href="/favicon-96x96.png"
        sizes="96x96"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </>
  ),
  logo: <Logo />,
  project: {
    link: "https://github.com/donadojs/next2app",
  },
};
