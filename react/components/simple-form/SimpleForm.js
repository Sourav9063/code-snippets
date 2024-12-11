import React, { useRef } from "react";

export function App(props) {
  const ref = useRef(null);
  return (
    <form
      ref={ref}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        console.log(formData.get("username")); //single value
        console.log(Object.fromEntries(formData)); //object
        ref.current?.reset();
      }}
    >
      <input type="text" name="username" disabled={false} />
      <input type="submit" />
    </form>
  );
}
