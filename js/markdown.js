// Simple Markdown Parser
function parseMarkdown(text) {
    if (!text) return '';
    
    let html = text;
    
    // Process code blocks first (before other formatting)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Process underline (HTML tags) before other markdown formatting
    html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    
    // Bold (must come before italic to avoid conflicts)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Italic - match single asterisks that aren't part of double asterisks
    // Split by bold markers, process italic in each segment
    const parts = html.split(/(<strong>.*?<\/strong>)/g);
    html = parts.map(part => {
        if (part.startsWith('<strong>')) {
            return part; // Already processed bold
        }
        // Process italic in this part
        return part.replace(/\*([^*]+?)\*/g, '<em>$1</em>')
                   .replace(/_([^_]+?)_/g, '<em>$1</em>');
    }).join('');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Unordered lists
    html = html.replace(/^[\*\-] (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
        html = '<p>' + html + '</p>';
    }
    
    return html;
}
