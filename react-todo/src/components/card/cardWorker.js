self.onmessage = function(event) {
    const { id, type, content } = event.data;

    let result;
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

    self.postMessage({ id, result });
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
