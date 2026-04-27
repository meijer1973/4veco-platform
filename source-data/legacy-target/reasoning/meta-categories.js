// Meta-categories for the Reasoning Game progress system.
// Maps paragraph+structureType (e.g. "3.1.1-A") to one of 8 meta-categories.
// Loaded before reasoning-engine.js in HTML shells.

window.REASONING_CATEGORIES = {
    categories: {
        "M1": { name: "Marktvormen", icon: "\uD83C\uDFEA", color: "#3b82f6", maxQuestions: 36 },
        "M2": { name: "Marktevenwicht", icon: "\u2696\uFE0F", color: "#06b6d4", maxQuestions: 21 },
        "M3": { name: "Winst & kosten", icon: "\uD83D\uDCB0", color: "#8b5cf6", maxQuestions: 30 },
        "M4": { name: "Strategie", icon: "\uD83C\uDFAF", color: "#f59e0b", maxQuestions: 15 },
        "M5": { name: "Doelmatigheid", icon: "\uD83D\uDCCA", color: "#10b981", maxQuestions: 21 },
        "M6": { name: "Overheid", icon: "\uD83C\uDFDB\uFE0F", color: "#ef4444", maxQuestions: 48 },
        "M7": { name: "Handel", icon: "\uD83C\uDF0D", color: "#0ea5e9", maxQuestions: 39 },
        "M8": { name: "Handelsbeleid", icon: "\uD83D\uDCDC", color: "#ec4899", maxQuestions: 30 }
    },
    mapping: {
        "3.1.1-A": "M1", "3.1.1-B": "M1", "3.1.1-C": "M1", "3.1.1-D": "M1",
        "3.1.2-A": "M1", "3.1.2-B": "M1", "3.1.2-C": "M1", "3.1.2-D": "M2",
        "3.1.3-A": "M1", "3.1.3-B": "M2", "3.1.3-C": "M1", "3.1.3-D": "M5",
        "3.2.1-A": "M2", "3.2.1-B": "M2", "3.2.1-C": "M3", "3.2.1-D": "M3",
        "3.2.2-A": "M3", "3.2.2-B": "M3", "3.2.2-C": "M2", "3.2.2-D": "M2",
        "3.2.3-A": "M3", "3.2.3-B": "M3", "3.2.3-C": "M3", "3.2.3-D": "M4",
        "3.2.4-A": "M4", "3.2.4-B": "M4", "3.2.4-C": "M4", "3.2.4-D": "M4",
        "3.2.5-A": "M3", "3.2.5-B": "M3", "3.2.5-C": "M1", "3.2.5-D": "M1",
        "3.2.6-A": "M5", "3.2.6-B": "M5", "3.2.6-C": "M5", "3.2.6-D": "M5",
        "3.2.7-A": "M1", "3.2.7-B": "M2", "3.2.7-C": "M5", "3.2.7-D": "M5",
        "3.3.1-A": "M6", "3.3.1-B": "M6", "3.3.1-C": "M6", "3.3.1-D": "M6",
        "3.3.2-A": "M6", "3.3.2-B": "M6", "3.3.2-C": "M6", "3.3.2-D": "M6",
        "3.3.3-A": "M6", "3.3.3-B": "M6", "3.3.3-C": "M6", "3.3.3-D": "M6",
        "3.3.4-A": "M6", "3.3.4-B": "M6", "3.3.4-C": "M6", "3.3.4-D": "M6",
        "3.4.1-A": "M7", "3.4.1-B": "M7", "3.4.1-C": "M7", "3.4.1-D": "M8",
        "3.4.2-A": "M7", "3.4.2-B": "M7", "3.4.2-C": "M7", "3.4.2-D": "M8",
        "3.4.3-A": "M3", "3.4.3-B": "M7", "3.4.3-C": "M7", "3.4.3-D": "M7",
        "3.4.4-A": "M7", "3.4.4-B": "M7", "3.4.4-C": "M7", "3.4.4-D": "M7",
        "3.4.5-A": "M8", "3.4.5-B": "M8", "3.4.5-C": "M8", "3.4.5-D": "M8",
        "3.4.6-A": "M8", "3.4.6-B": "M8", "3.4.6-C": "M8", "3.4.6-D": "M8"
    }
};
