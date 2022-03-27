import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";

import { DataContext } from "../../components/reducer";

export default function App() {
  const router = useRouter();
  const [state, dispatch] = React.useContext(DataContext);

  React.useEffect(() => {
    console.log(state);
    if (!state.application || !state.timestamp || !state.file) {
      router.push('/');
    }
  }, [])

  return (
    <div>
      <div onClick={() => router.back()}>
        <h3>Go back</h3>
      </div>
    </div>
  )
}
