"use client";

import { useState } from "react";
import { voteOnCaption } from "./actions";

export default function VoteButtons({ captionId }: { captionId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleVote = async (voteValue: number) => {
    setLoading(true);
    setMessage(null);
    const result = await voteOnCaption(captionId, voteValue);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({
        type: "success",
        text: voteValue > 0 ? "Upvoted!" : "Downvoted!",
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <div className="vote-group">
        <button
          type="button"
          onClick={() => handleVote(1)}
          disabled={loading}
          className="vote-btn"
          title="Upvote"
        >
          <i className="bi bi-hand-thumbs-up-fill" />
        </button>
        <button
          type="button"
          onClick={() => handleVote(-1)}
          disabled={loading}
          className="vote-btn"
          title="Downvote"
        >
          <i className="bi bi-hand-thumbs-down-fill" />
        </button>
      </div>
      {message && (
        <small style={{ color: message.type === "success" ? "var(--success)" : "var(--danger)" }}>
          {message.text}
        </small>
      )}
    </div>
  );
}
