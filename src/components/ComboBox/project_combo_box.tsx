import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { fetchGetProject } from '@/api/ForeignKeyCombox';
import { Project } from '@/api/ForeignKeyCombox/types/foreignKeyCombox';

interface ProjectComboBoxProps {
    setProject: (project: string) => void;
}

const ProjectComboBox: React.FC<ProjectComboBoxProps> = ({ setProject }) => {
    const [projects, setProjects] = useState<readonly Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        fetchGetProject()
            .then(response => {
                setProjects(response);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }, []);

    const handleProjectChange = (_event: React.SyntheticEvent, value: Project | null) => {
        setSelectedProject(value);
        setProject(value ? value.name : '');
    };

    return (
        <div>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={projects}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Project" />}
                onChange={handleProjectChange}
            />
            {selectedProject && (
                <div>
                    <h3>Selected Project: {selectedProject.name}</h3>
                </div>
            )}
        </div>
    );
};

export default ProjectComboBox;
