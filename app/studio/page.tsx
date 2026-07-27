import {
  chatGPTSignOutPath,
  requireChatGPTUser,
} from "../chatgpt-auth";
import { requirePortfolioAdmin } from "../portfolio-server";
import { notFound } from "next/navigation";
import StudioClient from "./studio-client";
import "./studio.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Private portfolio controls",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default async function PortfolioStudioPage() {
  await requireChatGPTUser("/studio");
  const authorization = await requirePortfolioAdmin();
  if ("error" in authorization) notFound();
  const user = authorization.user;

  return (
    <StudioClient
      user={{ displayName: user.displayName, email: user.email }}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
