//TextContentCard.tsx
import React, { Component } from 'react';
import { CardIdProps } from '../CardId';

interface TextContentCardProps extends CardIdProps {
    textContent: string;
}

interface TextContentCardState {
    editableText: string;
    editMode: boolean;
}

class TextContentCard extends Component<TextContentCardProps, TextContentCardState> {
    constructor(props: TextContentCardProps) {
        super(props);
        this.state = {
            editableText: this.props.textContent,
            editMode: false
        };
    }

    toggleEditMode = () => {
        this.setState({ editMode: !this.state.editMode });
    }

    handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ editableText: event.target.value });
    }

    saveChanges = () => {
        // Ici, vous pourriez envoyer les changements à un serveur ou les enregistrer localement
        console.log('Saving changes:', this.state.editableText);
        this.toggleEditMode(); // Quitte le mode édition après la sauvegarde
    }

    render() {
        const { editMode, editableText } = this.state;

        return (
            <div>
                {editMode ? (
                    <textarea
                        value={editableText}
                        onChange={this.handleTextChange}
                        rows={10}
                        cols={30}
                    />
                ) : (
                    <p>{editableText}</p>
                )}
                <button onClick={this.toggleEditMode}>
                    {editMode ? 'Annuler' : 'Modifier'}
                </button>
                {editMode && <button onClick={this.saveChanges}>Sauvegarder</button>}
            </div>
        );
    }
}

export default TextContentCard;
