import { useRouter } from "next/router";
import Link from "next/link";

export default function App() {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div>
      <p>Application: {name}</p>
      <Link href="/" passHref>
        <h1>Go back</h1>
      </Link>
    </div>
  )
}
