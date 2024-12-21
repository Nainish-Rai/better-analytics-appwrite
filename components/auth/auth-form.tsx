"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
});

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
  });

  async function onSubmit(data: z.infer<typeof authSchema>) {
    setIsLoading(true);

    try {
      if (isLogin) {
        await account.createEmailPasswordSession(data.email, data.password);
      } else {
        await account.create(ID.unique(), data.email, data.password, data.name);
        await account.createEmailPasswordSession(data.email, data.password);
      }
      router.push("/dashboard");
      toast.success(
        isLogin ? "Logged in successfully" : "Account created successfully"
      );
    } catch (error) {
      toast.error("Authentication failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md"
    >
      {!isLogin && (
        <Input {...register("name")} placeholder="Name" disabled={isLoading} />
      )}
      <Input
        {...register("email")}
        type="email"
        placeholder="Email"
        disabled={isLoading}
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}
      <Input
        {...register("password")}
        type="password"
        placeholder="Password"
        disabled={isLoading}
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : isLogin ? "Sign In" : "Register"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => setIsLogin(!isLogin)}
        disabled={isLoading}
      >
        {isLogin
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </Button>
    </form>
  );
}
