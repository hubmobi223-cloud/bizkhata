import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Sign in error",
};

export default function AuthCodeErrorPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">
          Could not complete sign in
        </CardTitle>
        <CardDescription className="text-center">
          The authentication link was invalid, expired, or already used.
          Please try signing in again.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button asChild>
          <Link href="/auth/sign-in">Back to sign in</Link>
        </Button>
      </CardContent>
    </Card>
  );
}