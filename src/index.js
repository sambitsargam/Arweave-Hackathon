import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./assets/css/tailwind.output.css";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext";
import ThemedSuspense from "./components/ThemedSuspense";
import { Windmill } from "@windmill/react-ui";
import * as serviceWorker from "./serviceWorker";
import AuthProvider from "./utils/AuthProvider";
import { MoralisProvider } from "react-moralis";
import { ThemeProvider } from "next-themes";

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('react-axe')
//   axe(React, ReactDOM, 1000)
// }
 
ReactDOM.render(
  // <ThemeProvider attribute="class">
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill usePreferences>
        <AuthProvider>
          <MoralisProvider
            appId="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijk1MjM1NjVmLWVhY2UtNDUwMi1hZGQ3LTE4MWFjNDgxMjkwZCIsIm9yZ0lkIjoiMTU5MzAwIiwidXNlcklkIjoiMTU4OTQ0IiwidHlwZUlkIjoiOTk1YWFlZjAtYjY4Zi00ZTVhLWI4Y2UtMGJkOTdiMzQwNjMxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODcwMzM5MzksImV4cCI6NDg0Mjc5MzkzOX0.LumSDgs3L1s1mvFvYnFtnk_etHyJtnKkdveFGBq48LQ"
            serverUrl="https://authapi.moralis.io/challenge/request/evm"
          >
            <App />
          </MoralisProvider>
        </AuthProvider>
      </Windmill>
    </Suspense>
  </SidebarProvider>,
  // </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
