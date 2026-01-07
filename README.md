```
# Fitter Dashboard

A real-time dashboard that tracks jobs completed by each fitter in the optical lab.
Displays live operational data on a TV to improve visibility, performance tracking, and workflow efficiency.

## Features

- Live job count per fitter
- Dashboard designed for TV or monitor display
- Easy to maintain and extend
- Future-ready for backend integration (API, MySQL, RxCore)
- Clean, modern UI

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js + Express (API integration)
- **Optional hardware:** Raspberry Pi for TV display

## Project Structure

```

fitter-dashboard/
├── public/       # Static assets
├── server/       # Backend API
├── src/          # React app source code
├── .gitignore
├── package.json
└── README.md

````

## Usage

### Install dependencies
```bash
npm install
````

### Run development server

```bash
npm start
```

### Run backend API

```bash
node server/index.js
```

### Build production bundle

```bash
npm run build
```

