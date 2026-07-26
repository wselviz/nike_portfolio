import {
  chatGPTSignOutPath,
  requireChatGPTUser,
} from "../chatgpt-auth";
import StudioClient from "./studio-client";
import "./studio.css";

export const dynamic = "force-dynamic";

export default async function PortfolioStudioPage() {
  const user = await requireChatGPTUser("/studio");

  return (
    <StudioClient
      user={{ displayName: user.displayName, email: user.email }}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
