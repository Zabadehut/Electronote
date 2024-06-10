self.onmessage = function(event) {
    const { id, type, content } = event.data;

    let result;
    let memoryUsage;

    switch (type) {
        case 'text':
            result = handleTextCard(content);
            break;
        case 'code':
            result = handleCodeCard(content);
            break;
        case 'file':
            result = handleFileCard(content);
            break;
        default:
            result = null;
    }

    // Simulate memory usage calculation
    memoryUsage = new Blob([content]).size;

    self.postMessage({ id, result, memoryUsage });
};

function handleTextCard(content) {
    return content.toUpperCase();
}

function handleCodeCard(content) {
    return content;
}

function handleFileCard(content) {
    return content;
}
