"use client";

import { DidResolver } from "@atproto/identity/dist/did/index";
import { debounce, throttle } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const exampleUrl = "https://bsky.app/profile/maloo.ski/post/3l3j5rfe4w52g";
const placeholderUrl = "at://did:plc:rodounzb7hsexmrbxmcodrbq/app.bsky.feed.post/3l3j5rfe4w52g";

function parseAtprotoUriParts(uri: string) {
    // at://did:plc:oejazvm3gdzx55pg4lyucan3/app.bsky.feed.post/3l2xute7zej2w
    const did = uri.split("/")[2];
    const action = uri.split("/")[3];
    const cid = uri.split("/")[4];

    return {
        did: did,
        cid: cid,
        action: action,
    };
}

const resolver = new DidResolver({
    plcUrl: "https://plc.directory",
});

async function resolveDid(did: string) {
    if (!did) {
        console.log("no did");
        return null;
    }

    try {
        const res = await resolver.resolve(did);

        let handle = res?.alsoKnownAs?.[0];
        if (!handle) {
            console.log("no handle");
            return null;
        }

        // trim "at://" from handle
        const handlePrefix = "at://";
        if (handle.startsWith(handlePrefix)) {
            handle = handle.slice(handlePrefix.length);
        }

        return handle;
    } catch (e) {
        console.error(e);
        return null;
    }
}

function buildBskyUrl(handle: string, cid: string) {
    return `https://bsky.app/profile/${handle}/post/${cid}`;
}

export default function Home() {
    "use client";

    const [url, setUrl] = useState<string>("");
    const [handle, setHandle] = useState<string>("");
    const [cid, setCid] = useState<string>("");

    useEffect(() => {
        console.log("url", url);
        const parts = parseAtprotoUriParts(url);
        setCid(parts.cid);
        setHandle("");

        resolveDid(parts.did).then((handle) => {
            console.log("handle", handle);
            if (!handle) return;
            setHandle(handle);
        });
    }, [url]);

    let bskyUrl = "";
    let buttonText = "Enter a URL";
    if (handle) {
        bskyUrl = buildBskyUrl(handle, cid);
        buttonText = `Go to ${handle}'s post`;
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

            <form className="flex flex-col gap-4 min-w-[300px]">
                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
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
                <a
                    href={bskyUrl || "#"}
                    target="_blank"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-center"
                    type="submit"
                    rel="noreferrer"
                >
                    {buttonText}
                </a>
            </form>
        </div>
    );
}
