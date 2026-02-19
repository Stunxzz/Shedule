import React from 'react';
import {Box} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {createGroup} from '../../api/groups';
import CreateGroup from "../../components/GroupsAndPermissions/CreateGroupForm.jsx";

export default function CreateGroupPage() {
    const navigate = useNavigate();
    const handleCreate = async (data) => {
        try {
            const result = await createGroup(data);

            navigate('/groups', {
                state: {
                    message: `Group "${result.name}" created successfully`,
                    severity: 'success',
                },
            });

        } catch (err) {
            const errorMessage =
                err.response?.data?.name?.[0] ||
                err.response?.data?.permissions?.[0] ||
                err.response?.data?.detail ||
                'Failed to create group';

            navigate('/groups', {
                state: {
                    message: errorMessage,
                    severity: 'error',
                },
            });
        }

    };

    return (
        <Box sx={{p: 0}}>
            <CreateGroup onSubmit={handleCreate}/>
        </Box>
    );
}
