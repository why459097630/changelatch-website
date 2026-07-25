import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sessionId =
      typeof body.sessionId === "string" ? body.sessionId : null;

    const landingPath =
      typeof body.landingPath === "string"
        ? body.landingPath
        : "/";

    const referrer =
      typeof body.referrer === "string"
        ? body.referrer
        : null;

    if (!sessionId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing sessionId",
        },
        {
          status: 400,
        },
      );
    }

    const supabase = await createClient();

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    const { error: pageViewError } = await supabase
      .from("page_view_logs")
      .insert({
        user_id: user?.id || null,
        session_id: sessionId,
        page_path: landingPath,
        referrer,
        query_string: landingPath.includes("?")
          ? landingPath.split("?")[1]
          : null,
      });

    if (pageViewError) {
      console.error("[PAGE VIEW TRACK ERROR]", pageViewError);

      return NextResponse.json(
        {
          ok: false,
          error: "Failed to record page view",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("[PAGE VIEW TRACK ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}