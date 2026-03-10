export const getOptimizedImageUrl = (url: string, width: number = 400) => {
    if (!url) return "";

    if (url.includes("images.unsplash.com")) {
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}w=${width}&q=80&auto=format&fit=crop`;
    }

    return url;
};