// error.tsx entity file
"use client";

import React, { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <h2>Something went wrong!</h2>
    </main>
  );
}
