import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import db from '../db/db';
import DWFile from '../models/DWFile';
import FileTypes from '../models/FileTypes';

const router = Router();

// GET all files
router.get('/', async (req, res) => {
    await db.read();
    const files = db.chain.get('dwFiles').value();
    res.send(files);
});

// GET a single file by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    await db.read();
    const file = db.chain.get('dwFiles').find({ id }).value();
    if (file) {
        res.send(file);
    } else {
        res.status(404).send({ message: 'File not found' });
    }
});

// POST a new file
router.post('/', async (req, res) => {
    const { name, parentFolderId, type, references, contents, createdBy } = req.body;
    
    const newFile: DWFile = {
        id: uuidv4(),
        name,
        slug: slugify(name, { lower: true }),
        type: type as FileTypes, // Ensure the type matches the FileTypes enum
        parentFolderId,
        references: references || [], // Default to an empty array if not provided
        contents: contents || [], // Default to an empty array if not provided
        createdAt: new Date(),
        createdBy,
        lastModifiedAt: new Date(),
        lastModifiedBy: createdBy,
    };

    await db.read();
    db.chain.get('dwFiles').push(newFile).value();
    await db.write();
    res.status(201).send(newFile);
});

// PUT to update a file by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    await db.read();
    const index = db.chain.get('dwFiles').findIndex({ id }).value();
    if (index !== -1) {
        const updatedFile = {
            ...db.data.dwFiles[index], 
            ...updateData, 
            lastModifiedAt: new Date(),
            // Explicitly handle references and contents to avoid accidental replacement
            references: updateData.references || db.data.dwFiles[index].references,
            contents: updateData.contents || db.data.dwFiles[index].contents
        };
        db.data.dwFiles[index] = updatedFile;
        await db.write();
        res.send(updatedFile);
    } else {
        res.status(404).send({ message: 'File not found' });
    }
});

// PATCH to partially update a file by ID (similar to PUT)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    await db.read();
    const file = db.chain.get('dwFiles').find({ id }).value();
    if (file) {
        const updatedFile = { ...file, ...updateData, lastModifiedAt: new Date() };
        await db.chain.get('dwFiles').find({ id }).assign(updatedFile).value();
        await db.write();
        res.send(updatedFile);
    } else {
        res.status(404).send({ message: 'File not found' });
    }
});

// DELETE a file by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    await db.read();
    const index = db.chain.get('dwFiles').findIndex({ id }).value();
    if (index !== -1) {
        db.chain.get('dwFiles').splice(index, 1).value();
        await db.write();
        res.status(204).send();  // 204 No Content
    } else {
        res.status(404).send({ message: 'File not found' });
    }
});

export default router;
