# Auto Stack Navigation for Next.js (alpha)

## Why I Built This

Hey there! 👋

You know that feeling when you're building a web app and something just feels... off? That's exactly how I felt about page transitions in web apps compared to native ones.

Look, Next.js is awesome. It's got this great routing system built in. But let's be real - when you build a web app with it, it just doesn't _feel_ as smooth as native apps. Sure, you could rip out the entire routing system and build your own, but... who's got time for that? 😅

I kept thinking, "There's got to be a stupidly simple way to add native-like transitions without turning my codebase into spaghetti." And that's when it hit me - what if we could get those smooth iOS/Android-style transitions by just adding _one_ component to our layout?

So that's what I built. Literally just wrap your app with this:

```tsx
// app/layout.tsx
import { StackNavigation } from "@react2app/auto-stack-navigation";

export default function RootLayout({ children }) {
  return (
    <>
      <OtherCodes>
        <StackNavigation>{children}</StackNavigation>
      </OtherCodes>
    </>
  );
}
```

And boom! 💥 You've got native-like page transitions. No extra configuration, no messing with routing, no sacrificing your firstborn. Just smooth, satisfying transitions.

## The Good Stuff

- 🌊 Silky smooth transitions just like native apps
- 🔄 Back button that actually feels right
- 🎯 Want some pages without animations? No problem!
- ⚡️ Zero config needed (but you can tweak stuff if you want)
- 📱 Perfect for making your web app feel more... appy
- 🎨 Don't like the animation speed? Change it!

## Get Started

Install the package:

```bash
# npm folks
npm install @react2app/auto-stack-navigation

# yarn if that's your thing
yarn add @react2app/auto-stack-navigation

# pnpm gang
pnpm add @react2app/auto-stack-navigation
```

Add it in your layout:

```tsx
// app/layout.tsx
import { StackNavigation } from "@react2app/auto-stack-navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return { children };
}
```

That's literally it. Go click around your app and enjoy those smooth transitions! ✨

## Want to Customize?

```tsx
<StackNavigation
  // Don't want animations on certain pages? List 'em here
  animationDisabledUrls={["/", "/about"]}

  // Animation too fast/slow? Change it (in milliseconds)
  animationDuration={500}
>
  {children}

```

## How It Actually Works

Behind the scenes, it's doing some neat stuff:

1. Caches your pages so transitions look smooth
2. Manages a navigation stack (just like native apps)
3. Takes care of all the animation timing

## Examples

### Basic Setup

Just the standard setup we saw above. Nothing fancy needed!

### Skip Animations on Certain Pages

Maybe you don't want transitions on your landing page:

```tsx
<StackNavigation
  animationDisabledUrls={["/", "/login", "/signup"]}
>
  {children}

```

## Contributing

Found a bug? Want to add something cool? PRs are welcome!

## More...

Currently, this is a work in progress. I'm keep working on it to make it more robust and flexible. Want to know more about it? DM me on [Twitter](https://x.com/donadojs)

## License

MIT © donadojs

---

If you're using this in your project, I'd love to hear about it! Drop a star ⭐ if you found it useful.

Questions? Issues? Hit me up in the GitHub issues!
