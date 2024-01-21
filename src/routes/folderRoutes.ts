import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import db from '../db/db';
import Folder from '../models/Folder';

const router = Router();

// GET all folders
router.get('/', async (req, res) => {
    await db.read();
    const folders = db.chain.get('folders').value();
    res.send(folders);
});

// GET a single folder by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    await db.read();
    const folder = db.chain.get('folders').find({ id }).value();
    if (folder) {
        res.send(folder);
    } else {
        res.status(404).send({ message: 'Folder not found' });
    }
});

// POST a new folder
router.post('/', async (req, res) => {
    const { name, parentId, createdBy } = req.body;

    const newFolder: Folder = {
        id: uuidv4(),
        name,
        slug: slugify(name, { lower: true }),
        parentId,
        createdAt: new Date(),
        createdBy,
        lastModifiedAt: new Date(),
        lastModifiedBy: createdBy,
    };

    await db.read();
    db.chain.get('folders').push(newFolder).value();
    await db.write();
    res.status(201).send(newFolder);
});

// PUT to update a folder by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    await db.read();
    const index = db.chain.get('folders').findIndex({ id }).value();
    if (index !== -1) {
        const updatedFolder = { ...db.data.folders[index], ...updateData, lastModifiedAt: new Date() };
        db.data.folders[index] = updatedFolder;
        await db.write();
        res.send(updatedFolder);
    } else {
        res.status(404).send({ message: 'Folder not found' });
    }
});

// PATCH to partially update a folder by ID (similar to PUT)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    await db.read();
    const folder = db.chain.get('folders').find({ id }).value();
    if (folder) {
        const updatedFolder = { ...folder, ...updateData, lastModifiedAt: new Date() };
        await db.chain.get('folders').find({ id }).assign(updatedFolder).value();
        await db.write();
        res.send(updatedFolder);
    } else {
        res.status(404).send({ message: 'Folder not found' });
    }
});

// DELETE a folder by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await db.read();
    const index = db.chain.get('folders').findIndex({ id }).value();
    if (index !== -1) {
        db.chain.get('folders').splice(index, 1).value();
        await db.write();
        res.status(204).send();  // 204 No Content
    } else {
        res.status(404).send({ message: 'Folder not found' });
    }
});

export default router;
