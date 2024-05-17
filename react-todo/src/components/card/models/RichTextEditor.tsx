import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichTextEditor.css';

interface RichTextEditorProps {
    value: string;
    onChange: (data: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    return (
        <div className="rich-text-editor">
            <ReactQuill value={value} onChange={onChange} />
        </div>
    );
};

export default RichTextEditor;

