import React from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';

// Définir l'interface pour les icônes
interface QuillIcons {
    [key: string]: string | { [key: string]: string };
}

Quill.register('modules/imageResize', ImageResize);

// Importer les icônes de Quill
const icons = Quill.import('ui/icons') as QuillIcons;

// Définir les nouvelles icônes en utilisant Font Awesome
icons['bold'] = '<i class="fa fa-bold" aria-hidden="true"></i>';
icons['italic'] = '<i class="fa fa-italic" aria-hidden="true"></i>';
icons['underline'] = '<i class="fa fa-underline" aria-hidden="true"></i>';
icons['strike'] = '<i class="fa fa-strikethrough" aria-hidden="true"></i>';

icons['list'] = icons['list'] || {};
(icons['list'] as { [key: string]: string })['ordered'] = '<i class="fa fa-list-ol" aria-hidden="true"></i>';
(icons['list'] as { [key: string]: string })['bullet'] = '<i class="fa fa-list-ul" aria-hidden="true"></i>';

icons['indent'] = icons['indent'] || {};
(icons['indent'] as { [key: string]: string })['+1'] = '<i class="fa fa-indent" aria-hidden="true"></i>';
(icons['indent'] as { [key: string]: string })['-1'] = '<i class="fa fa-outdent" aria-hidden="true"></i>';

icons['script'] = icons['script'] || {};
(icons['script'] as { [key: string]: string })['sub'] = '<i class="fa fa-subscript" aria-hidden="true"></i>';
(icons['script'] as { [key: string]: string })['super'] = '<i class="fa fa-superscript" aria-hidden="true"></i>';

icons['blockquote'] = '<i class="fa fa-quote-right" aria-hidden="true"></i>';
icons['direction'] = icons['direction'] || {};
(icons['direction'] as { [key: string]: string })['rtl'] = '<i class="fa fa-align-right" aria-hidden="true"></i>';

icons['code-block'] = '<i class="fa fa-code" aria-hidden="true"></i>';
icons['image'] = '<i class="fa fa-picture-o" aria-hidden="true"></i>';
icons['video'] = '<i class="fa fa-video-camera" aria-hidden="true"></i>';
icons['link'] = '<i class="fa fa-link" aria-hidden="true"></i>';
icons['clean'] = '<i class="fa fa-eraser" aria-hidden="true"></i>';
icons['formula'] = '<i class="fa fa-superscript" aria-hidden="true"></i>';

icons['align'] = icons['align'] || {};
(icons['align'] as { [key: string]: string })[''] = '<i class="fa fa-align-left" aria-hidden="true"></i>';
(icons['align'] as { [key: string]: string })['center'] = '<i class="fa fa-align-center" aria-hidden="true"></i>';
(icons['align'] as { [key: string]: string })['right'] = '<i class="fa fa-align-right" aria-hidden="true"></i>';
(icons['align'] as { [key: string]: string })['justify'] = '<i class="fa fa-align-justify" aria-hidden="true"></i>';

// Custom Undo button icon component for Quill editor
const CustomUndo = () => (
    <svg viewBox="0 0 18 18" style={{ width: '24px', height: '24px' }}>
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
    </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
    <svg viewBox="0 0 18 18" style={{ width: '24px', height: '24px' }}>
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
    </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange(this: any) {
    this.quill.history.undo();
}
function redoChange(this: any) {
    this.quill.history.redo();
}

// Add sizes to whitelist and register them
const Size = Quill.import('formats/size') as any;
Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font') as any;
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = (toolbarId: string) => ({
    toolbar: {
        container: `#${toolbarId}`,
        handlers: {
            undo: undoChange,
            redo: redoChange,
        },
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
    },
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
});

// Formats objects for setting up the Quill editor
export const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'align',
    'strike', 'script', 'blockquote', 'background', 'list', 'bullet',
    'indent', 'link', 'image', 'video', 'color', 'code-block', 'formula'
];

// Quill Toolbar component
interface QuillToolbarProps {
    toolbarId: string;
}

const QuillToolbar: React.FC<QuillToolbarProps> = ({ toolbarId }) => (
    <div id={toolbarId} className="ql-toolbar">
        <span className="ql-formats">
            <select className="ql-font" defaultValue="arial" style={{ height: '40px', lineHeight: '38px' }}>
                <option value="arial">Arial</option>
                <option value="comic-sans">Comic Sans</option>
                <option value="courier-new">Courier New</option>
                <option value="georgia">Georgia</option>
                <option value="helvetica">Helvetica</option>
                <option value="lucida">Lucida</option>
            </select>
            <select className="ql-size" defaultValue="medium" style={{ height: '40px', lineHeight: '38px' }}>
                <option value="extra-small">Size 1</option>
                <option value="small">Size 2</option>
                <option value="medium">Size 3</option>
                <option value="large">Size 4</option>
            </select>
            <select className="ql-header" defaultValue="3" style={{ height: '40px', lineHeight: '38px' }}>
                <option value="1">Heading</option>
                <option value="2">Subheading</option>
                <option value="3">Normal</option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            <button className="ql-script" value="super" />
            <button className="ql-script" value="sub" />
            <button className="ql-blockquote" />
            <button className="ql-direction" value="rtl" />
        </span>
        <span className="ql-formats">
            <select className="ql-align" style={{ height: '40px', lineHeight: '38px' }} />
            <select className="ql-color" style={{ height: '40px', lineHeight: '38px' }} />
            <select className="ql-background" style={{ height: '40px', lineHeight: '38px' }} />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
            <button className="ql-video" />
        </span>
        <span className="ql-formats">
            <button className="ql-formula" />
            <button className="ql-code-block" />
            <button className="ql-clean" />
        </span>
        <span className="ql-formats">
            <button className="ql-undo">
                <CustomUndo />
            </button>
            <button className="ql-redo">
                <CustomRedo />
            </button>
        </span>
    </div>
);

export default QuillToolbar;
