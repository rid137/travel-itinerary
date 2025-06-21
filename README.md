# Travel Itinerary

This is the web app for the **Travel Itinerary Platform**, where users can search and add **flights**, **hotels**, and **activities** to a personalized itinerary.  
Built with **TypeScript**, **Next.js**, and **Tailwind CSS**.

## Getting Started

#### First, clone the repository:

```bash
git clone https://github.com/rid137/travel-itinerary.git
```

## API and Environment Variables

This project integrates with third-party APIs to fetch flight, hotel, and activity data. API keys and sensitive credentials are managed using environment variables.

### Setting Up Environment Variables

1. Create a `.env.local` file in the root directory.
2. Add your API keys and configuration as shown below:

   ```env
   NEXT_PUBLIC_RAPIDAPI_KEY=your_flight_api_key
   ```

3. Never commit `.env.local` to version control. The `.gitignore` file already excludes it by default.

Refer to the documentation of RapidAPI for details on obtaining your API key.

### Package Manager

This project uses `npm` as the package manager. If you don't have Node.js (which includes `npm`) installed, download it from [Node.js official website](https://nodejs.org). Once installed, `npm` will be available on your system.

#### Install all dependencies

```bash
npm install
```

#### Run the development server:

```bash
npm run dev
```

- By default, this will run the project on [http://localhost:3000](http://localhost:3000)
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the web-app.
