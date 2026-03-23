"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function voteOnCaption(captionId: string, voteValue: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in to vote" };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return { error: "Profile not found" };

  const { error } = await supabase.from("caption_votes").insert({
    caption_id: captionId,
    profile_id: profile.id,
    vote_value: voteValue,
    created_by_user_id: profile.id,
    modified_by_user_id: profile.id,
  });

  if (error) {
    if (error.code === "23505") return { error: "You already voted on this caption" };
    return { error: error.message };
  }

  revalidatePath("/captions");
  return { success: true };
}
