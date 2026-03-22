$urls = @(
    "https://21st.dev/r/shadcn/input",
    "https://21st.dev/r/shadcn/tabs",
    "https://21st.dev/r/shadcn/card",
    "https://21st.dev/r/shadcn/avatar",
    "https://21st.dev/r/shadcn/skeleton",
    "https://21st.dev/r/shadcn/form",
    "https://21st.dev/r/shadcn/alert",
    "https://21st.dev/r/shadcn/table",
    "https://21st.dev/r/shadcn/progress",
    "https://21st.dev/r/shadcn/dropdown-menu",
    "https://21st.dev/r/shadcn/badge",
    "https://21st.dev/r/shadcn/calendar",
    "https://21st.dev/r/jakubkanna/ai-chat",
    "https://21st.dev/r/shadcn/textarea",
    "https://21st.dev/r/shadcn/scroll-area",
    "https://21st.dev/r/shadcn/popover",
    "https://21st.dev/r/shadcn/pagination",
    "https://21st.dev/r/shadcn/radio-group",
    "https://21st.dev/r/shadcn/slider",
    "https://21st.dev/r/shadcn/dialog",
    "https://21st.dev/r/magicui/number-ticker",
    "https://21st.dev/r/magicui/animated-gradient-text",
    "https://21st.dev/r/magicui/magic-card",
    "https://21st.dev/r/magicui/particles",
    "https://21st.dev/r/magicui/marquee",
    "https://21st.dev/r/magicui/animated-list"
)

foreach ($url in $urls) {
    Write-Host "Installing $url..."
    npx --yes shadcn@latest add $url --overwrite
}
Write-Host "Component Installation Phase Complete."
