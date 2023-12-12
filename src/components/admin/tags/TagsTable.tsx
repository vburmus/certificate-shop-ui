import React, {useState} from 'react';
import {Tag} from '../../../utils/types';
import {Button} from "reactstrap";
import ConfirmationModal from "../../common/ConfirmationModal";
import TagEditingModal from "./TagEditingModal";
import {deleteTag} from "../../../utils/tagUtils";

interface TagsTableProps {
    tags: Tag[],
}

const TagsTable: React.FC<TagsTableProps> = ({tags}) => {
        const [isEditing, setIsEditing] = useState(false)
        const [editingTag, setEditingTag] = useState<Tag | null>(null)
        const [isDeleting, setIsDeleting] = useState(false)
        const [detelingTag, setDetelingTag] = useState<Tag | null>(null)

        return (
            <>
                <table className="table">
                    <thead>
                    <tr className="text-center">
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tags.map((tag) => (
                        <tr key={tag.id} className="text-center align-content-center">
                            <td>{tag.name}</td>
                            <td>
                                <Button className="btn btn-warning" onClick={() => {
                                    setIsEditing(true);
                                    setEditingTag(tag);
                                }}>Edit</Button>
                                <Button className="btn btn-danger m-2" onClick={() => {
                                    setIsDeleting(true);
                                    setDetelingTag(tag);
                                }}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {isEditing && editingTag && <TagEditingModal closeModal={setIsEditing} tag={editingTag}/>}
                {isDeleting && detelingTag && <ConfirmationModal closeModal={setIsDeleting} action={() => {
                    deleteTag(detelingTag.id);
                    window.location.reload()
                }} text={`Deleting tag with id = ${detelingTag.id}`}/>}

            </>
        );
    }
;

export default TagsTable;
