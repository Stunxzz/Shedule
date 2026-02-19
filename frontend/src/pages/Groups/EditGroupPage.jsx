// src/pages/groups/EditGroupPage.jsx
import {Box} from '@mui/material';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import GroupForm from '../../components/GroupsAndPermissions/CreateGroupForm.jsx';
import {fetchGroup, updateGroup} from '../../api/groups';

export default function EditGroupPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);

    useEffect(() => {
        const loadGroup = async () => {
            try {
                const data = await fetchGroup(id);
                setGroup(data);
            } catch (err) {
                navigate('/groups', {
                    state: {
                        message: 'Failed to load group',
                        severity: 'error',
                    },
                });
            }
        };

        loadGroup();

    }, [id, navigate]);

    const handleUpdate = async (data) => {
        try {
            const result = await updateGroup(id, data);

            navigate('/groups', {
                state: {
                    message: `Group "${result.name}" updated successfully`,
                    severity: 'success',
                },
            });

        } catch (err) {
            const errorMessage =
                err.response?.data?.name?.[0] ||
                err.response?.data?.permissions?.[0] ||
                err.response?.data?.detail ||
                'Failed to update group';

            navigate('/groups', {
                state: {
                    message: errorMessage,
                    severity: 'error',
                },
            });
        }

    };

    if (!group) return null;

    return (
        <Box sx={{p: 0}}>
            <GroupForm initialData={group} onSubmit={handleUpdate}/>
        </Box>
    );
}
