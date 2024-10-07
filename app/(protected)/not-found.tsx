import Link from "next/link";
import { Button } from "@/components/ui/button";
import { bodoni } from "@/lib/fonts";
function NotFoundProtected() {
  return (
    <section className="w-full flex items-center px-[5%] text-foreground  flex-col gap-4 justify-center ipad:max-h-[1300px] h-dvh min-h-[500px] ">
      <h2
        className={`font-[900]  text-2xl desktop:text-4xl ${bodoni.className}  text-center w-full`}
      >
        404 - PAGE NOT FOUND
      </h2>
      <p className="w-full ipad:w-3/4   text-center">
        The page you are looking for might have been removed had its name
        changes or is temporary unavailable{" "}
      </p>
      <Button asChild size="lg">
        <Link href="/">GO TO HOMEPAGE</Link>
      </Button>
    </section>
  );
}

export default NotFoundProtected;
