import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import db from '../db/db';
import Project from '../models/Project';

const router = Router();

// GET all projects
router.get('/', async (req, res) => {
    await db.read();
    const projects = db.chain.get('projects').value();
    res.send(projects);
});

// GET a single project by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    await db.read();
    const project = db.chain.get('projects').find({ id }).value();
    if (project) {
        res.send(project);
    } else {
        res.status(404).send({ message: 'Project not found' });
    }
});

// POST a new project
router.post('/', async (req, res) => {
    const { name, rootFolderId, rootFolderName, rootFolderSlug, createdBy } = req.body;

    const newProject: Project = {
        id: uuidv4(),
        name,
        slug: slugify(name, { lower: true }),
        rootFolderId,
        rootFolderName,
        rootFolderSlug,
        createdAt: new Date(),
        createdBy,
        lastModifiedAt: new Date(),
        lastModifiedBy: createdBy,
    };

    await db.read();
    db.chain.get('projects').push(newProject).value();
    await db.write();
    res.status(201).send(newProject);
});

// PUT to update a project by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    await db.read();
    const index = db.chain.get('projects').findIndex({ id }).value();
    if (index !== -1) {
        const updatedProject = { ...db.data.projects[index], ...updateData, lastModifiedAt: new Date() };
        db.data.projects[index] = updatedProject;
        await db.write();
        res.send(updatedProject);
    } else {
        res.status(404).send({ message: 'Project not found' });
    }
});

// PATCH to partially update a project by ID (similar to PUT)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    await db.read();
    const project = db.chain.get('projects').find({ id }).value();
    if (project) {
        const updatedProject = { ...project, ...updateData, lastModifiedAt: new Date() };
        await db.chain.get('projects').find({ id }).assign(updatedProject).value();
        await db.write();
        res.send(updatedProject);
    } else {
        res.status(404).send({ message: 'Project not found' });
    }
});

// DELETE a project by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await db.read();
    const index = db.chain.get('projects').findIndex({ id }).value();
    if (index !== -1) {
        db.chain.get('projects').splice(index, 1).value();
        await db.write();
        res.status(204).send();  // 204 No Content
    } else {
        res.status(404).send({ message: 'Project not found' });
    }
});

export default router;
