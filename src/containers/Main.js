import React from "react";

function Main({ children }) {
  return (
    <main className="h-full w-full overflow-y-auto ">
      {/* <div className="container grid px-6 mx-auto"> */}
      <div className="container grid px-6 mx-auto">{children}</div>
    </main>
  );
}

export default Main;
