import { DidResolver, HandleResolver } from "@atproto/identity";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const exampleUrl = "https://bsky.app/profile/maloo.ski/post/3l3j5rfe4w52g";
const placeholderUrl = "at://did:plc:rodounzb7hsexmrbxmcodrbq/app.bsky.feed.post/3l3j5rfe4w52g";

async function atprotoUriToBskyRUrl(uri: string) {
    // at://did:plc:oejazvm3gdzx55pg4lyucan3/app.bsky.feed.post/3l2xute7zej2w
    const did = uri.split("/")[2];
    const postId = uri.split("/")[4];

    console.log(did, postId);

    const resolver = new DidResolver({
        plcUrl: "https://plc.directory",
    });
    const res = await resolver.resolve(did);
    let handle = res?.alsoKnownAs?.[0];
    if (!handle) {
        throw new Error("Could not resolve handle");
    }

    // trim "at://" from handle
    const handlePrefix = "at://";
    if (handle.startsWith(handlePrefix)) {
        handle = handle.slice(handlePrefix.length);
    }

    console.log(handle, postId);

    return `https://bsky.app/profile/${handle}/post/${postId}`;
}

export default function Home() {
    async function redirectToBskyUrl(formData: FormData) {
        "use server";

        let url = formData.get("url") as string;
        url = url.trim();

        if (url.startsWith('"') || url.startsWith("'")) {
            url = url.slice(1, -1);
        }

        if (url.endsWith('"') || url.endsWith("'")) {
            url = url.slice(0, -1);
        }

        if (!url) {
            throw new Error("No URL provided");
        }

        const bskyUrl = await atprotoUriToBskyRUrl(url);
        redirect(bskyUrl);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl font-bold">ATProto to Bluesky</h1>

            <p className="text-lg">Redirect ATProto URLs to Bluesky URLs</p>

            <div className="text-sm text-gray-500 absolute top-1 right-1">
                <a href="https://bsky.app/profile/maloo.ski" target="_blank" className="text-blue-500" rel="noreferrer">
                    Support me 🥺
                </a>
            </div>

            <form action={redirectToBskyUrl} className="flex flex-col gap-4 min-w-[300px]">
                <input
                    className="border border-gray-300 rounded-md p-2"
                    name="url"
                    type="text"
                    placeholder="Enter a URL"
                />
                <a target="_blank" href={exampleUrl} className="text-blue-500 text-sm" rel="noreferrer">
                    <div className="flex flex-row gap-2 items-center">
                        Example:
                        <span className="font-mono text-xs">{placeholderUrl}</span>
                    </div>
                </a>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" type="submit">
                    Go!
                </button>
            </form>
        </div>
    );
}
