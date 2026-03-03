import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase-server";

export async function GET() {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const serviceClient = await createServiceClient();
        const { data, error } = await serviceClient
            .from("gallery")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ items: data });
    } catch (error) {
        console.error("Gallery GET error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { image, originalImage, title, style, metadata } =
            await request.json();

        if (!image) {
            return NextResponse.json(
                { error: "image is required" },
                { status: 400 }
            );
        }

        const serviceClient = await createServiceClient();

        // Upload image to Supabase Storage
        const imageBuffer = Buffer.from(image, "base64");
        const filename = `${user.id}/${Date.now()}-result.png`;

        const { error: uploadError } = await serviceClient.storage
            .from("gallery-images")
            .upload(filename, imageBuffer, {
                contentType: "image/png",
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 }
            );
        }

        const {
            data: { publicUrl: imageUrl },
        } = serviceClient.storage.from("gallery-images").getPublicUrl(filename);

        // Upload original image if provided
        let originalImageUrl: string | null = null;
        if (originalImage) {
            const originalBuffer = Buffer.from(originalImage, "base64");
            const originalFilename = `${user.id}/${Date.now()}-original.png`;

            const { error: origUploadErr } = await serviceClient.storage
                .from("gallery-images")
                .upload(originalFilename, originalBuffer, {
                    contentType: "image/png",
                    upsert: false,
                });

            if (!origUploadErr) {
                const {
                    data: { publicUrl },
                } = serviceClient.storage
                    .from("gallery-images")
                    .getPublicUrl(originalFilename);
                originalImageUrl = publicUrl;
            }
        }

        // Insert gallery record
        const { data: galleryItem, error: insertError } = await serviceClient
            .from("gallery")
            .insert({
                user_id: user.id,
                image_url: imageUrl,
                original_image_url: originalImageUrl,
                title: title || "Untitled Design",
                style: style || null,
                metadata: metadata || {},
            })
            .select()
            .single();

        if (insertError) {
            return NextResponse.json(
                { error: "Failed to save gallery item" },
                { status: 500 }
            );
        }

        return NextResponse.json({ item: galleryItem }, { status: 201 });
    } catch (error) {
        console.error("Gallery POST error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "id is required" }, { status: 400 });
        }

        const serviceClient = await createServiceClient();

        // Verify ownership and get image URL for cleanup
        const { data: item } = await serviceClient
            .from("gallery")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // Delete from storage
        if (item.image_url) {
            const path = item.image_url.split("/gallery-images/").pop();
            if (path) {
                await serviceClient.storage.from("gallery-images").remove([path]);
            }
        }
        if (item.original_image_url) {
            const path = item.original_image_url.split("/gallery-images/").pop();
            if (path) {
                await serviceClient.storage.from("gallery-images").remove([path]);
            }
        }

        // Delete record
        await serviceClient.from("gallery").delete().eq("id", id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Gallery DELETE error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
