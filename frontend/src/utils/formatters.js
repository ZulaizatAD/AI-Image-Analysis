export const formatAnalysis = (text) => {
    if (!text) return "";

    return text
        .replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-semibold text-cadetblue-900">$1</strong>'
        )
        .replace(/\*(.*?)\*/g, '<em class="italic text-cadetblue-700">$1</em>')
        .split("\n")
        .map((line, index) => {
            if (line.trim().startsWith("##")) {
                return `<h3 key=${index} class="text-lg font-bold text-cadetblue-900 mt-4 mb-2">${line
                    .replace("##", "")
                    .trim()}</h3>`;
            } else if (line.trim().startsWith("#")) {
                return `<h2 key=${index} class="text-xl font-bold text-cadetblue-900 mt-6 mb-3">${line
                    .replace("#", "")
                    .trim()}</h2>`;
            } else if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
                return `<li key=${index} class="ml-4 text-cadetblue-700">${line.replace(
                    /^[-•]\s*/,
                    ""
                )}</li>`;
            } else if (line.trim()) {
                return `<p key=${index} class="text-cadetblue-700 mb-2">${line}</p>`;
            }
            return `<br key=${index} />`;
        })
        .join("");
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatRelativeTime = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return "Just now";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return formatDate(dateString);
    }
};

export const formatPercentage = (value, total, decimals = 1) => {
    if (total === 0) return "0%";
    return ((value / total) * 100).toFixed(decimals) + "%";
};

export const formatNumber = (number) => {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
    }
    return number.toString();
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

export const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatCalories = (calories) => {
    if (!calories) return "0 cal";
    return `${Math.round(calories)} cal`;
};

export const formatMacros = (carbs, protein, fat) => {
    const total = carbs + protein + fat;
    if (total === 0) return { carbs: "0%", protein: "0%", fat: "0%" };

    return {
        carbs: formatPercentage(carbs, total),
        protein: formatPercentage(protein, total),
        fat: formatPercentage(fat, total)
    };
};