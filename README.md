This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# Adding new Vocabulary

There is an insert file command that can be modified to include new cards and then executed by running from within project root directory:
node src/utils/insert-vocab-cards.js

# Spaced Repetition vocabulary

The logic by which the vocabulary cards are pulled through to main board is determined by the below criteria:

- If the last attempt was incorrect (regardless of success rate), review in 10 mins.
- Success rate > 90 %, review in 2 weeks.
- Success rate > 75 %, review in 1 week.
- Success rate > 50 %, review in 3 days.
- All other cases, review in 1 day.

(success rate = correct attempts at a card/ total attempts)

These are pulled through alongside non attempted cards for the user.

If guest user only random cards will be pulled through and no progress data will saved.

# Auth options

Nextauth.js is used to help manage the user login session. I have implemented a manual credential login option aswell if the user
doesn't have one of the OAuth accounts listed. This 'ordinary' credential option means user objects with different structures. For example
credential user will have a username where as google user will have just a name and the unique field of image. This image field will be used
to differentiate between the two objects in shared space. 
